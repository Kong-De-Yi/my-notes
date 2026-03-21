interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  home.resident = { name: "Victor the Evictor", age: 42 };
}
