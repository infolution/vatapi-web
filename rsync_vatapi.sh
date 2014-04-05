rsync -vauz --progress --partial --exclude=.idea --rsh=ssh --stats dist/* admin@infolution.biz:www/vatapi/vatapi-static
