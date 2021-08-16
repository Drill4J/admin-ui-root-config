#! /bin/bash
IFS=','
read -a strarr <<<"$PLUGINS"
echo "{" >>/usr/share/nginx/html/plugin-urls.json
for entrie in "${strarr[@]}"; do
  plugin="$(cut -d'#' -f1 <<<"${entrie}")"
  link="$(cut -d'#' -f2 <<<"${entrie}")"
  if [ "${entrie}" = "${strarr[-1]}" ]; then
     echo " \"${plugin}\": \"${link}\"" >>/usr/share/nginx/html/plugin-urls.json
  else
    echo " \"${plugin}\": \"${link}\"," >>/usr/share/nginx/html/plugin-urls.json
  fi
done
echo "}" >>/usr/share/nginx/html/plugin-urls.json
