#!/usr/bin/env bash

find-relative-imports() {
    fd . -t f -ets | xargs grep -nE 'import .* from "\.' | awk -F: '{ print $2 " " $1 }'
}
