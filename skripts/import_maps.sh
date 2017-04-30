#!/bin/sh

operation="$1"

if test "$operation" = "alb" || test "$operation" = "lc" || test "$operation" = "rgb" || test "$operation" = "vhod"; then
    input="$2"
    if test -e "$input"; then
        dir=$(dirname "$0")
        name=$(echo "$input" | rev | cut -d "/" -f 1 | rev | cut -d "." -f 1)
        zoomRange="7-13"

        if test "$operation" = "rgb"; then
            satelit="$3"
            if test "$satelit" = "L" || test "$satelit" = "l" || test "$satelit" = "S" || test "$satelit" = "s"; then
                if test "$satelit" = "L" || test "$satelit" = "l"; then
                    bands="-b 4 -b 3 -b 2"
                elif test "$satelit" = "S" || test "$satelit" = "s"; then
                    bands="-b 3 -b 2 -b 1"
                fi

                gdal_translate -scale -ot Byte $bands "$input" "$dir/../data/rgb_rastre/$name.localsrs"
                gdalwarp -t_srs "EPSG:3857" "$dir/../data/rgb_rastre/$name.localsrs" "$dir/../data/rgb_rastre/$name.tif"
                gdalbuildvrt "$dir/../data/rgb_rastre/$name.vrt" "$dir/../data/rgb_rastre/$name.tif"
                gimp "$dir/../data/rgb_rastre/$name.tif"
                gdal2tiles.py -z "$zoomRange" -w none -s "EPSG:3857" "$dir/../data/rgb_rastre/$name.vrt" "$dir/../data/rgb_rastre/$name"
                rm "$dir/../data/rgb_rastre/$name."*
            else
                echo "Report satellite type { S | L } as second positional argument!"
                exit 1
            fi
        else
            gdalwarp -t_srs "EPSG:3857" -dstnodata 0 "$input" "$dir/../data/${operation}_rastre/$name.tif"
            gdaldem color-relief "$dir/../data/${operation}_rastre/$name.tif" "$dir/${operation}_color.txt" "$dir/../data/${operation}_rastre/$name.png" -alpha -of PNG
            gdal2tiles.py -z "$zoomRange" -w none -s "EPSG:3857" "$dir/../data/${operation}_rastre/$name.png" "$dir/../data/${operation}_rastre/$name"
            rm "$dir/../data/${operation}_rastre/$name."*
        fi
    else
        echo "File $input Does not exists!"
        exit 1
    fi
else
    if test "$operation" != ""; then
        echo "I don't know operation $1!"
        exit 1
    else
        echo "You must speciffy type of map!"
        exit 1
    fi
fi
