const onModel = ["Project", "Folder"];
const fileExtensions = ["c", "cpp", "css", "html", "js", "php", "py", "txt"];

const msg = `Welcome to PPA.
PPA is an online compiler and pair-programming tool for:
C, C++, Python, Java, PHP, C#, HTML, CSS, JS.
Code, Compile, Run and share online from anywhere in world.
`;

const msgForC = `/******************************************************************************

${msg}

*******************************************************************************/
`;

const js = `${msgForC}

let res=1;
for(let i=1; i<=10; i++){
  res *=i;
  console.log("Fahkultaet von %d ist %d\\n", i, res);
}
`;

const c = `${msgForC}

#include <stdio.h>

int main()
{
  int res=1;
  for(int i=1; i<=10; i++){
      res *=i;
      printf("Fahkultaet von %d ist %d\\n", i, res);
  }

  return 0;
}
`;

const cpp = `${msgForC}

#include <iostream>

using namespace std;

int main()
{
  int res = 1;
  for(int i=1; i<=10; i++){
    res *=i;
    cout<<"Fahkultaet von " << i <<" ist "<< res <<endl;
  }

  return 0;
}
`;
const py = `'''

${msg}

'''
res = 1
for i in range(1, 10):
    res *= i
    print('Fahkultaet von', i , 'ist:', res)
`;

const html = `<!--

${msg}

-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
`;

const txt = `${msg}

`;

const css = `${msgForC}

`;

const php = `<?php

${msgForC}

$res = 1;

for ($i = 1; $i <= 10; $i++) {
  $res *= $i;
  echo "Fakultät von $i ist $res\\n";
}
`;

const codeSourceBasic = {
  c,
  cpp,
  css,
  html,
  js,
  php,
  py,
  txt,
};

module.exports = { onModel, fileExtensions, codeSourceBasic };
