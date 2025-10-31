module.exports = {
  "user with id 1 exists": async () => {
    console.log("Setting up state: user with id 1 exists");
    // Your setup logic for user 1
    // This might involve seeding your database
    return Promise.resolve();
  },
  
  "user with id 2 exists": async () => {
    console.log("Setting up state: user with id 2 exists");
    // Your setup logic for user 2
    return Promise.resolve();
  },
  
  "user with id 999 does not exist": async () => {
    console.log("Setting up state: user with id 999 does not exist");
    // Your setup logic to ensure user 999 doesn't exist
    // This might involve clearing test data
    return Promise.resolve();
  }
};