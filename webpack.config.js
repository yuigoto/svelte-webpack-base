const autoprefixer = require("autoprefixer");
const copyWebpack = require("copy-webpack-plugin");
const fs = require("fs");
const htmlWebpack = require("html-webpack-plugin");
const path = require("path");
const miniCssExtract = require("mini-css-extract-plugin");
const sass = require("sass");
const sveltePreprocess = require("svelte-preprocess");
const svelteMarkdown = require("svelte-preprocess-markdown");

/**
 * Diretório de trabalho atual, sempre relativo ao diretório de onde é 
 * executado o webpack.
 * 
 * @type {string}
 */
const THE_CWD = process.cwd();

/**
 * @param {*} env 
 *     Informações relativas ao ambiente
 * @param {*} argv 
 *     Argumentos passados ao Webpack
 * @returns {import("webpack").Configuration}
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  // STYLESHEET LOADERS
  // --------------------------------------------------------------------
 
  // CSS padrão
  const cssLoader = {
    loader: "css-loader",
    options: {
      importLoaders: 2,
      sourceMap: false,
    },
  };
 
  // Post CSS
  const postCssLoader = {
    loader: "postcss-loader",
    options: {
      sourceMap: false,
      postcssOptions: {
        plugins: [
          autoprefixer({
            flexbox: "no-2009",
          }),
        ],
      },
    },
  };
 
  // SASS
  const sassLoader = {
    loader: "sass-loader",
    options: {
      implementation: sass, 
      sourceMap: false,
      sassOptions: {
        precision: 8,
        outputStyle: "compressed",
        sourceComments: false,
        includePaths: [
          path.resolve(THE_CWD, "src", "styles"),
        ],
        quietDeps: true, 
      },
    },
  };

  // Styles globais
  const styleLoader = isProduction
    ? miniCssExtract.loader 
    : "style-loader";

  // --------------------------------------------------------------------

  /**
   * @type {import("webpack").Configuration}
   */
  const webpackConfig = {};

  webpackConfig.stats = {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: true,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: false
  };

  webpackConfig.target = "web";
  
  webpackConfig.mode = !isProduction ? "development" : "production";

  webpackConfig.entry = {
    build: path.resolve(THE_CWD, "./src", "index.js"),
  };
  
  webpackConfig.devtool = false;
  
  webpackConfig.output = {
    // Inclui comentários sobre caminho dos arquivos
    pathinfo: false,
    path: path.resolve(THE_CWD, "dist"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].[id].js",
    publicPath: "/",
    clean: true,
  };
  
  webpackConfig.module = {
    rules: [
      // JavaScript e Módulos JS
      {
        test: /\.(js|mjs)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: [
                      "last 2 Chrome versions",
                      "last 2 Firefox versions",
                      "last 2 Safari versions",
                      "last 2 iOS versions",
                      "last 1 Android version",
                      "last 1 ChromeAndroid version",
                      // Usando isso aqui `regenerator-runtime` dá pau:
                      // "ie 11"
                    ],
                  },
                },
              ]
            ],
            plugins: [
              "dynamic-import-node",
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
            ],
          },
        }
      },
      
      // Svelte
      {
        test: /\.(svelte|md)$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              // Você PRECISA disso pro HMR funcionar!
              dev: !isProduction,
            },
            emitCss: isProduction,
            css: false,
            hotReload: !isProduction,
            hotOptions: {
              // Se preservamos estado local (tipo, qualquer `let`) ou apenas 
              // props públicas (`export let`)
              noPreserveState: false,
              // Tenta recuperar de erros de runtime ao inicializar componente,
              // pode dar ruim se os componentes não forem puros o suficiente
              optimistic: true,
            },
            preprocess: [
              sveltePreprocess({
                postcss: true,
                sass: {
                  implementation: sass,
                  precision: 8,
                  outputStyle: "compressed",
                  sourceComments: false,
                  includePaths: [
                    path.resolve(THE_CWD, "src", "styles"),
                  ],
                  quietDeps: true, 
                }
              }),
              svelteMarkdown.markdown(),
            ]
          },
        },
      },

      // Stylesheets (exceto Svelte)
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /svelte\.\d+\.(sa|sc|c)ss/,
        use: [
          styleLoader,
          cssLoader,
          postCssLoader,
          sassLoader
        ],
      },

      // Stylesheets Svelte
      {
        test: /\.(sa|sc|c)ss$/,
        include: /svelte\.\d+\.(sa|sc|c)ss/,
        use: [
          styleLoader,
          cssLoader,
        ],
      },
      
			{
        // Precisa disso para prevenir erros do Svelte no Webpack 5+
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			},

      // Fonts (exceto SVG)
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            esModule: false,
            outputPath: "assets/fonts/",
            publicPath: "/assets/fonts"
          }
        }
      },

      // Imagens
      {
        test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            esModule: false,
            outputPath: "assets/img/",
            publicPath: "/assets/img",
          }
        }
      },

      // Mídia
      {
        test: /\.(wav|mp3|mp4|avi|mpg|mpeg|mov|ogg|webm)$/,
        use: {
          loader: "file-loader",
          options: {
            esModule: false,
            outputPath: "assets/media/",
            publicPath: "/assets/media",
          }
        }
      },

      // Documentos
      {
        test: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/,
        use: {
          loader: "file-loader",
          options: {
            esModule: false,
            outputPath: "assets/data/",
            publicPath: "/assets/data",
          }
        }
      },
    ],
  };

  webpackConfig.plugins = [
    new miniCssExtract({
      filename: "[name].css"
    }),

    new htmlWebpack({
      inject: true,
      filename: "index.html",
      template: path.join(THE_CWD, "public", "index.html"),
      hash: true,
      minify: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        collapseWhitespace: true,
      },
    }),

    new copyWebpack({
      patterns: [
        {
          from: "public",
          to: "",
          toType: "dir",
          globOptions: {
            dot: true,
            ignore: [
              "**/*.html",
            ],
          },
        }
      ],
    }),
  ];

  webpackConfig.devServer = {
    hot: true,
    port: 3000
  };

  webpackConfig.optimization = {
    minimize: true,
    splitChunks: {
      chunks: "all",
      // Número máximo de requests paralelos em um entrypoint
      maxInitialRequests: Infinity,
      // Tamanho mínimo, em bytes, para um chunk ser gerado
      minSize: 0,
      cacheGroups: {
        build: {
          name: "build",
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
        },
      },
    },
  };

  webpackConfig.resolve = {
    alias: {
      // Garante que apenas uma cópia do svelte executará
      svelte: path.resolve("node_modules", "svelte"),
    },
    modules: [
      path.resolve(THE_CWD, "./src"),
      "node_modules",
    ],
    extensions: [
      ".js",
      ".mjs",
      ".json",
      ".svelte",
      ".md"
    ],
    // Defermina quais campos no package.json são usados 
    // para resolver identificadores
    mainFields: [
      "svelte",
      "browser",
      "module",
      "main"
    ],
  };

  return webpackConfig;
};
