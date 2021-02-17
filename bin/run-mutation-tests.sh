#!/bin/bash

echo "start: $(date)"

for file in mutation-tests/mutation_*.conf.js ; do
  echo "file: $file";
  count=0;
  while [ $count -lt 7 ]
  do
        yarn test:stryker $file ;
        let retVal=$?;
        if [ $retVal == 0 ];
        then
        count=7;
        else
        count=$(($count + 1));
        fi


  done
done

echo "end: $(date)"
