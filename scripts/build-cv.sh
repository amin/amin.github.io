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

# -output-directory sends .aux/.log/.out to a container temp dir so only the
# PDF comes back. :z relabels the bind mount, which SELinux requires on Fedora.
# The log is held back and printed only on failure, since a successful
# pdflatex run is several hundred lines of noise.
"${runtime[@]}" \
  -e HOME=/tmp \
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
