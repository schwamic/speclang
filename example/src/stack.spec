@stack "To Done App"
@status approved


services {
  frontend: {
    framework: "reactjs",
    ui: ["mui", "tailwindcss"],
    lang: "typescript",
    devtool: "vite",
    test_runner: vitest
  }
  backend: {
    framework: "fastify",
    lang: "typescript",
    engine: "nodejs",
    database: sqlite
  }
}

devenv {
  os: "macOS v26",
  node: "nvm use 22",
  ide: "vscode"
}
