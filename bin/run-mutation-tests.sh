#!/bin/bash

echo "start: $(date)"

for file in mutation-tests/mutation_*.conf.js ; do
  echo "file: $file";
  count=0;
  while [ $count -lt 5 ]
  do
        yarn test:stryker $file ;
        let retVal=$?;
        echo $retVal;
        if [ $retVal == 0 ];
        then
        count=5;
        else
        count=$(($count + 1));
        fi


  done
done

echo "end: $(date)"
