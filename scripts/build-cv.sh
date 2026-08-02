#!/usr/bin/env bash
# Compiles src/cv/amin_cv.tex into src/cv.pdf inside a TeX Live container, so
# no LaTeX has to be installed on the host. The PDF is committed and Eleventy
# only copies it, which keeps a broken .tex from ever breaking a deploy.
set -euo pipefail

# Fully qualified: podman refuses to guess a registry for a short name.
image="docker.io/texlive/texlive:latest-small"
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Rootless podman already maps container writes back to the invoking user;
# docker needs to be told, or it leaves a root-owned PDF behind.
if command -v podman >/dev/null 2>&1; then
  runtime=(podman run --rm --userns=keep-id)
elif command -v docker >/dev/null 2>&1; then
  runtime=(docker run --rm --user "$(id -u):$(id -g)")
else
  echo "build-cv: needs podman or docker to run TeX Live." >&2
  exit 1
fi

# pdfTeX stamps the wall clock into /CreationDate, /ModDate and the /ID hash,
# so rebuilding an unchanged .tex still produced a different PDF and git saw a
# 119 KB diff for no content change. Pinning the clock to the source's own
# mtime makes the build reproducible: same .tex in, byte-identical PDF out.
source_date="$(stat -c %Y "$root/src/cv/amin_cv.tex")"

# -output-directory sends .aux/.log/.out to a container temp dir so only the
# PDF comes back. :z relabels the bind mount, which SELinux requires on Fedora.
# The log is held back and printed only on failure, since a successful
# pdflatex run is several hundred lines of noise.
"${runtime[@]}" \
  -e HOME=/tmp \
  -e SOURCE_DATE_EPOCH="$source_date" \
  -e FORCE_SOURCE_DATE=1 \
  -v "$root/src:/src:z" \
  -w /src \
  "$image" \
  sh -c '
    pdflatex -interaction=nonstopmode -halt-on-error \
      -output-directory=/tmp cv/amin_cv.tex >/tmp/build.log 2>&1 ||
      { cat /tmp/build.log; exit 1; }
    cp /tmp/amin_cv.pdf /src/cv.pdf
  '

echo "build-cv: wrote src/cv.pdf"
