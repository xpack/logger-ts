#!/usr/bin/env bash

# -----------------------------------------------------------------------------
# Safety settings (see https://gist.github.com/ilg-ul/383869cbb01f61a51c4d).

if [[ ! -z ${DEBUG} ]]
then
  set ${DEBUG} # Activate the expand mode if DEBUG is anything but empty.
else
  DEBUG=""
fi

set -o errexit # Exit if command failed.
set -o pipefail # Exit if pipe failed.
set -o nounset # Exit if variable not set.

# Remove the initial space and instead use '\n'.
IFS=$'\n\t'

# -----------------------------------------------------------------------------
# Identify the script location, to reach, for example, the helper scripts.

script_path="$0"
if [[ "${script_path}" != /* ]]
then
  # Make relative path absolute.
  script_path="$(pwd)/$0"
fi

script_name="$(basename "${script_path}")"

script_folder_path="$(dirname "${script_path}")"
script_folder_name="$(basename "${script_folder_path}")"

# =============================================================================

docs_folder_path="$(dirname ${script_folder_path})/docs/"

echo "${docs_folder_path}"

cd "${docs_folder_path}"

function make_link_relative()
{
  src_path="$(echo "$1" | sed -e 's|[.][/]||')"
  dest_path="$(readlink $1 | sed -e "s|${docs_folder_path}||")"
  rm -fv "${1}"
  ln -sv "${dest_path}" "${src_path}"
}

find . -type l | while read file; do make_link_relative "$file"; done


# -----------------------------------------------------------------------------
