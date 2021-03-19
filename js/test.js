function mul_table(table_size) {
    let mul_table = new Array(table_size);
    for (let i=1; i<=table_size; i++) {
        mul_table [i-1] = [];
        for (let j=1; j<=table_size; j++) {
            mul_table [i-1] [j-1] = i * j;
        }
    }
    return mul_table;
}

console.log(mul_table(10));