async function getData(url){

  const response = await fetch(url);

  return response.text();
}

function nthElements(arr, start, step){
  var newArr = [];

  for (var i = start; i < arr.length; i += step){
    newArr.push(arr[i]);
  }

  return newArr;
}

var reference;

async function runTool(fasta, fileInput, limit, outputid){
  var input = document.getElementById(fasta).value;
  var files = document.getElementById(fileInput).files;
  var max = parseInt(document.getElementById(limit).value);

  showLoad();

  if (max == -1 || max == 0 || isNaN(max)){
    max = Infinity;
  }

  if (input == ""){
    if (files.length == 0){

      showError();
      hideAlert("loadAlert");

      return undefined;
    }
    else{
      input = document.getElementById("fastaFileText").textContent;
    }
  }
  else{
    input = document.getElementById(fasta).value;
  }

  reference = await getData('https://plwebtool.github.io/tools/db/ribo58s.fa');

  var output = generateDRNA(input, max)
  hideAlert("loadAlert");

  showSuccess();

  document.getElementById(outputid).value = output;
}

function isDRNA(seq, ref){
  /* Returns false if sequence is not a dRNA/CdRNA.
  Returns the matching sequence if it is a match */

  if (seq.length == 12){
    return ref.includes(seq);
  }
  else if (seq.length == 13 && seq[0] == "C"){
    return ref.includes(seq);
  }
  else{
    return false;
  }
}

function generateDRNA(input, max){

  var inputArray = input.split('\n');
  var descs = nthElements(inputArray, 0, 2);
  var seqs = nthElements(inputArray, 1, 2);

  var dArray = []

  for (var i = 0; i < seqs.length; i++){
    if ((dArray.length / 2) == max){
      return dArray
    }

    if (isDRNA(seqs[i], reference)){
      dArray.push(descs[i]);
      dArray.push(seqs[i]);
    }
  }

  return dArray.join('\n');
}
