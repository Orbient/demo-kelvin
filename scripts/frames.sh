#!/bin/zsh
# Cut a clip into a JPEG frame sequence for the scroll-scrubbed canvas.
# usage: scripts/frames.sh <src.mp4> <name> <frames> <width> [start] [end]
set -e
src=$1 name=$2 n=$3 w=$4 ss=${5:-0} to=${6:-}
out=public/assets/seq/$name-$w
rm -rf $out && mkdir -p $out
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
[[ -n $to ]] && dur=$(( to - ss )) || dur=$(( dur - ss ))
fps=$(( n / dur ))
ffmpeg -v error -ss $ss -t $dur -i "$src" -vf "fps=${fps},scale=${w}:-2:flags=lanczos" -q:v ${Q:-5} -frames:v $n "$out/%03d.jpg"
echo "$out $(ls $out | wc -l | tr -d ' ') frames $(du -sh $out | cut -f1)"
