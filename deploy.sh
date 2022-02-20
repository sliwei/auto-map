#online
NAME="auto-map"
ROOT="/data/git/${NAME}"
RUN="/data/wwwroot/${NAME}"

npm install --unsafe-perm
npm run build
mkdir -p ${RUN}
cp -rf ${ROOT}/prod/index.html ${RUN}/index.html