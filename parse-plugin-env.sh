#! /bin/bash

IFS=','

read -a strarr <<<"$PLUGINS"

# Print each value of the array by using the loop
echo "{" >>/usr/share/nginx/html/container-paths.json
for entrie in "${strarr[@]}"; do
  plugin="$(cut -d'#' -f1 <<<"${entrie}")"
  link="$(cut -d'#' -f2 <<<"${entrie}")"
  if [ "${entrie}" = "${strarr[-1]}" ]; then
     echo " \"${plugin}\": \"${link}\"," >>/usr/share/nginx/html/container-paths.json
  else
    echo " \"${plugin}\": \"${link}\"" >>/usr/share/nginx/html/container-paths.json
  fi
done
echo "}" >>/usr/share/nginx/html/container-paths.json
