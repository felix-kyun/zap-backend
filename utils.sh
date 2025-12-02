#!/usr/bin/env bash

find-relative-imports() {
    fd . -t f -ets | xargs grep -nE 'import .* from "\.' | awk -F: '{ print $2 " " $1 }'
}

post() {
    COOKIE_JAR=/tmp/cookie_jar.txt
    CSRF_TOKEN=$(curl -sLi -c $COOKIE_JAR "localhost:5173/api/csrf" | grep -Po '(?<=csrf_token=)[0-9a-zA-Z]+(?=;)')

    curl -sLi -b $COOKIE_JAR -c $COOKIE_JAR -X POST \
        -H "Content-Type: application/json" \
        -H "X-CSRF-Token: $CSRF_TOKEN" "$@"
}

json() {
    echo "$1" \
      | node -p 'JSON.stringify(eval("(" + require("fs").readFileSync(0, "utf8") + ")"))'
}
