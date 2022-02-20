#online
NAME="auto-map"
ROOT="/data/git/${NAME}"
RUN="/data/wwwroot/${NAME}"

yarn
yarn build
mkdir -p ${RUN}
cp -rf ${ROOT}/prod/index.html ${RUN}/index.html