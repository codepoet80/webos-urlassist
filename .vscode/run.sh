DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
echo copying latest common components
cp $DIR/../../webos-common/Mojo/updater-model.js $DIR/../app/models/updater-model.js
palm-run $DIR/../