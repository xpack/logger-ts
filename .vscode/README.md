# Visual Studio Code settings

The name of this folder must be in `.npmignore`, to be sure this file is
not archived into the package, but remains only in the Git version.

## settings.json

This file stores editor settings that help keep the source files compliant
with the project style: an 80 column ruler, two spaces for indentation,
and formatting on save with Prettier, using the configuration in
`maintenance/config/`. It is generated from a template (see the header
of the file), so do not edit it by hand.

## launch.json

This file stores configurations to start debug sessions of the tests,
which run under `tap`: one for the file that is open in the editor, and
some for individual test files. Each runs the `test-one` script in the
integrated terminal of the debugger, which attaches to the processes
started by `tap`.
