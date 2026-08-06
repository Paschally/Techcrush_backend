
score = 55
function grade(){
    if(score >= 70){
        return "A"
    }else if(score >= 50){
        return "B"
    }else{
        return "F"
    }

}

let result_one = grade();

const add = (num) => {
    console.log(num-7)
}

add(9)

students = ['Ada', 'Kenny', 'Mary', 'Ugo']
students.push("Dozie")
//console.log(students)

students.unshift('Glory')
//console.log(students)

// students.pop()
//console.log(students)

// students.shift()
//console.log(students)

//console.log(students.includes('Mara'))
//console.log(students.indexOf('Clara'))

console.log(students)
console.log(students.splice(2,2, "NJMM", "JLM<"))

let numbers = [5,6,7,9];
let mapped_num = numbers.map((num) => num * 4);
let filt_num = numbers.filter((num) => num > 6);

console.log(mapped_num)
console.log(filt_num)
