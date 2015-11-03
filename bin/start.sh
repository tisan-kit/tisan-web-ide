#!/bin/bash

abs_bin_path=$(cd `dirname $0`; pwd)
app_root_path=$(cd "$abs_bin_path/.."; pwd)
base_projects_path=$(cd $app_root_path/..; pwd)
node_modules_path=$(cd $app_root_path/../tisan-lib; pwd)

if ! [[ -d $app_root_path/logs ]]; then
	mkdir $app_root_path/logs
fi

all_node_path=$app_root_path:$base_projects_path:$node_modules_path

if ! [[ "$NODE_PATH"x = x ]]; then
	all_node_path=$all_node_path:$NODE_PATH
fi


export NODE_PATH=$all_node_path
echo $all_node_path
cd $app_root_path #ÇÐ»»µ½¸ùÄ¿Â¼
#command="pm2 start $abs_bin_path/www --name fandiantong-1 -e $app_root_path/logs/err.log -o $app_root_path/logs/out.log"
command="node $app_root_path/app.js"
exec $command $@
