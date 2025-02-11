+++
title = "Getting Started With uv, the Python Package & Project Manager"
date = 2025-02-11
description = "A quick reference guide covering uv basics and some cool tricks."

[extra]
toc = true
toc_ignore_pattern = "^Docs.*"
+++

> [uv](https://docs.astral.sh/uv/) is an extremely fast Python package and project manager, written in Rust. A single tool to replace pip, pip-tools, pipx, poetry, pyenv, twine, virtualenv, and more.

#### [Docs](https://docs.astral.sh/uv/) • [GitHub](https://github.com/astral-sh/uv) • [Skip to practical tips](#practical-tips) {.centered-text}

## Installation

See [the docs](https://docs.astral.sh/uv/getting-started/installation/) for more options (cargo, WinGet, Docker…).

### GNU+Linux & macOS

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh

# for macOS with brew
brew install uv
```

### Windows

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Drop-in compatible API

uv provides a [drop-in replacement for `pip`](https://docs.astral.sh/uv/pip/):

| `pip` command | `uv` command |
|------------|------------|
| `pip install` | `uv pip install` |
| `pip-compile` | `uv pip compile` |
| `pip-sync` | `uv pip sync` |
| `python -m venv .venv` | `uv venv` |
| `pip-compile requirements.in -o requirements.txt` | `uv pip compile requirements.in -o requirements.txt` |

> These commands work directly with the virtual environment, in contrast to uv's primary interfaces where the virtual environment is managed automatically.

{% admonition(type="note") %}
`uv` doesn't rely on or invoke `pip`. The pip interface is named as such to highlight its dedicated purpose of providing low-level commands that match pip's interface and to separate it from the rest of uv's commands which operate at a higher level of abstraction.
{% end %}

## Create a virtual environment

To create a virtual environment (venv) in the current directory:

```bash
uv venv
```

The venv will be in the `.venv/` directory. You can choose a different path with `uv venv /path/to/venv`.

To activate the venv (often unnecessary, read [below](#project-environments)): `source .venv/bin/activate`.

{% admonition(type="info") %}
`uv` doesn't store venvs in a centralised location; there's no ~~`uv venv list`~~. See issue [1495](https://github.com/astral-sh/uv/issues/1495).
{% end %}

## Working with projects

`uv` [helps manage Python projects](https://docs.astral.sh/uv/guides/projects/) with dependencies defined in `pyproject.toml`.

### Creating a project

```bash
uv init my-project
cd my-project

# Or initialise in current directory.
uv init
```

This creates a basic project structure:

```tree
.
├── .git/              # Initialised git repository.
├── .gitignore         # Python-specific gitignore.
├── .python-version    # Project's Python version.
├── README.md          # Empty readme file.
├── pyproject.toml     # Dependencies and metadata.
├── hello.py           # Sample Python script.
```

When you run project commands (like `uv run`), `uv` will create:

- `.venv/`: Project's virtual environment
- `uv.lock`: Exact dependency versions

### Managing dependencies

```bash
# Add a dependency.
uv add requests

# Remove it.
uv remove requests

# Update specific package.
uv lock --upgrade-package requests
```

Dependencies are declared in `pyproject.toml` and locked in `uv.lock`. Commit both files to version control for reproducible builds.

{% admonition(type="tip") %}
Want to migrate from poetry/pip-tools to uv? Try [mkniewallner/migrate-to-uv](https://github.com/mkniewallner/migrate-to-uv).
{% end %}

### Project environments

`uv` automagically creates and manages a project-specific virtual environment in `.venv`. When using `uv run`, it ensures your code executes in this environment with the correct dependencies:

```bash
# Run with project dependencies.
uv run script.py

# Add temporary dependencies for specific runs.
uv run --with pandas script.py

# Use a specific Python version.
uv run --python 3.9 script.py
```

### Installing requirements

To install requirements from a `requirements.txt` file:

```bash
uv pip install -r requirements.txt
```

### Syncing the environment

To synchronise the environment with the project's dependencies, use [`uv sync`](https://docs.astral.sh/uv/reference/cli/#uv-sync).

{% admonition(type="danger") %}
`uv sync` will **remove** any packages from your virtual environment that are not explicitly listed as dependencies in your `requirements.txt`, `pyproject.toml`, or lockfile.
{% end %}

This ensures that all dependencies specified in your `pyproject.toml` or `requirements.txt` are installed, and any extraneous packages are removed.

## Running Python scripts and commands

[`uv run`](https://docs.astral.sh/uv/reference/cli/#uv-run) ensures commands run in a Python environment. It's useful for:

- Running Python scripts: `uv run script.py`
- Running Python modules: `uv run -m pytest`
- Running commands in project environments: `uv run python`

When used in a project, if a virtual environment can be found in the current directory or a parent directory, the command will be run in that environment.

Outside a project, the command will be run in the environment of the discovered interpreter.

Common use cases:

```bash
# Run a script with dependencies from requirements.txt
uv run --with-requirements requirements.txt script.py

# Run pytest with extra dev dependencies.
uv run --group dev -m pytest

# Run a command in an isolated environment.
uv run --isolated python

# Run from a remote repository.
uvx --from git+https://github.com/httpie/cli https example.com

# Run a remote script (be careful!)
uv run https://example.com/script.py
```

## Tools

> Many Python packages provide applications that can be used as tools. uv has specialized support for [easily invoking and installing tools](https://docs.astral.sh/uv/guides/tools/).

If you want a globally available tool for your user (e.g. [ruff](https://astral.sh/ruff)), run:

```bash
uv tool install ruff
```

Now you can use `ruff` from anywhere on your system, as it's installed in a bin directory in your `PATH`.

### Running tools without installing them

`uvx` runs a tool without installing it:

```bash
uvx pycowsay 'be kind!'
```

`uvx` is an alias for `uv tool run`.

If you want to quickly format a file with `ruff` without installing it:

```bash
uvx ruff script.py
```

## Clearing the cache

> [uv uses aggressive caching](https://docs.astral.sh/uv/concepts/cache/) to avoid re-downloading (and re-building) dependencies that have already been accessed in prior runs.

```bash
# Remove all cached packages.
uv cache clean

# Clean cache for specific package.
uv cache clean ruff

# Remove only unused cache entries.
uv cache prune
```

## Practical tips

### Run any Python version with any number of dependencies

All without manually creating venvs or installing anything globally:

```bash
uv run --python 3.13 --with polars,seaborn python
```

For quick prototyping, you can run Jupyter notebooks with dependencies:

```bash
uv run --with "jupyter,altair,matplotlib,numpy,polars,seaborn" jupyter notebook
```

Or start an interactive Python shell with a specific Python version and dependencies:

```bash
uv run --python 3.11 --with "ipython,requests,pandas,python-dotenv" ipython
```

### Reproducible Jupyter notebooks with juv

[juv](https://github.com/manzt/juv) is a uv-powered toolkit for creating reproducible Jupyter notebooks.

```bash
# Install globally.
uv tool install juv

# Or run without installing.
uvx juv
```

Here's what you can do with it:

```bash
# Create a new notebook.
juv init notebook.ipynb
juv init --python=3.9 notebook.ipynb  # specify Python version.

# Add dependencies to a notebook.
juv add notebook.ipynb pandas numpy

# Launch notebook with dependencies.
juv run notebook.ipynb

# Add temporary dependencies.
juv run --with=polars notebook.ipynb

# Convert Python scripts to notebooks on the fly.
uvx juv run script.py

# Lock dependencies.
juv lock notebook.ipynb

# Export dependencies in pip-compatible format.
juv export notebook.ipynb
```

Dependencies are stored in the notebook's metadata, so you can share notebooks with others and ensure they have the correct environment.

### Use uv as your shebang line

From [Rob Allen's blog](https://akrabat.com/using-uv-as-your-shebang-line/) ([via HN](https://news.ycombinator.com/item?id=42855258)):

Use `uv` in your script's shebang line to automatically handle dependencies:

```bash
#!/usr/bin/env -S uv run --script
```

This allows you to create executable Python scripts that manage their own dependencies. You can declare dependencies inline ([PEP-723](https://peps.python.org/pep-0723/)):

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.13"
# dependencies = ["cowsay"]
# ///

import cowsay
cowsay.cow("uv shebang works!")
```

Make the script executable (`chmod +x script.py`), and you're good to go!
