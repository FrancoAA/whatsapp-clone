
(async () => {

const Parse = require('parse/node');
const Moment = require('moment');

Parse.initialize('B2opqxpHNXzU5KeF3u2pBcgTmomBV8lb7vc46qCd', '', 'DZC9zTY0yBipAyw1gRElcx0UkcYgsixu9P66ZK8P');
Parse.serverURL = 'http://localhost:1337/parse';

const adminUserData = {
  username: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin',
  picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
};

const usersData = [
  {
    username: 'Ethan Gonzalez',
    email: 'ethan.gonzales@gmail.com',
    picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
  },
  {
    username: 'Bryan Wallace',
    email: 'bryan.wallace@gmail.com',
    picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
  },
  {
    username: 'Avery Stewart',
    email: 'avery.stewart@gmail.com',
    picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
  },
  {
    username: 'Katie Peterson',
    email: 'katie.peterson@gmail.com',
    picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
  },
  {
    username: 'Ray Edwards',
    email: 'ray.edwards@gmail.com',
    picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
  }
];

const chatsData = [
  {
    name: 'Ethan Gonzalez',
    picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
  },
  {
    name: 'Bryan Wallace',
    picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
  },
  {
    name: 'Avery Stewart',
    picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
  },
  {
    name: 'Katie Peterson',
    picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
  },
  {
    name: 'Ray Edwards',
    picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
  }
];

const messagesData = [
  {
    text: 'You on your way?',
    timestamp: Moment().subtract(1, 'hours').toDate()
  },
  {
    text: 'Hey, it\'s me',
    timestamp: Moment().subtract(2, 'hours').toDate()
  },
  {
    text: 'I should buy a boat',
    timestamp: Moment().subtract(1, 'days').toDate()
  },
  {
    text: 'Look at my mukluks!',
    timestamp: Moment().subtract(4, 'days').toDate()
  },
  {
    text: 'This is wicked good ice cream.',
    timestamp: Moment().subtract(2, 'weeks').toDate()
  }
];

const User = Parse.Object.extend('User');
const Chat = Parse.Object.extend('Chats');
const Message = Parse.Object.extend('Messages');

let adminUser;
const users = [];
const chats = [];
const messages = [];

console.log('Creating admin account...');
try {
  let checkIfAdminExistsQuery = new Parse.Query('User').equalTo('email', adminUserData.email);
  adminUser = await checkIfAdminExistsQuery.first();
  if (!adminUser) {
    console.log(`Creating admin user...`);
    adminUser = new User();
    adminUser.set('username', adminUserData.username);
    adminUser.set('password', adminUserData.password);
    adminUser.set('email', adminUserData.email);
    adminUser.set('picture', adminUserData.picture);
    await adminUser.save();
  }
} catch (error) {
  throw new Error(error);
}

// Setup users
console.log('Creating users...');
try {
  for (const u of usersData) {
    let checkIfExistsQuery = new Parse.Query('User').equalTo('email', u.email);
    const userFound = await checkIfExistsQuery.first();
    if (!userFound) {
      console.log(`Creating ${u.username} because it doesn't exists...`);
      let newUser = new User();
      newUser.set('username', u.username);
      newUser.set('password', '123456');
      newUser.set('email', u.email);
      newUser.set('picture', u.picture);
      await newUser.save();
      users.push(newUser);
    } else {
      users.push(userFound);
    }
  }
} catch (error) {
  throw new Error(error);
}

// Clear the messages
console.log('Clearing messages...');
let allMessagesQuery = new Parse.Query('Messages');
let allMessages = await allMessagesQuery.find();
await Parse.Object.destroyAll(allMessages);
console.log('All messages cleared.');

// Clear the chats
console.log('Clearing chats...');
let allChatsQuery = new Parse.Query('Chats');
let allChats = await allChatsQuery.find();
await Parse.Object.destroyAll(allChats);
console.log('All chats cleared.');

try {
  console.log('Creating chats...');
  for (const [i, u] of users.entries()) {
    const chatInstance = new Chat();
    chatInstance.set('usersList', [adminUser.id, u.id]);
    chatInstance.set('avatar', u.get('picture'));
    chatInstance.set('name', u.get('username'));
    await chatInstance.save();
    chats.push(chatInstance);
  }
} catch (error) {
  throw new Error(error);
}

try {
  console.log('Creating messages...');
  for (const [i, m] of messagesData.entries()) {
    const messageInstace = new Message();
    messageInstace.set('text', m.text);
    messageInstace.set('chatId', chats[i].id);
    messageInstace.set('sender', users[i]);
    await messageInstace.save();
    chats[i].set('lastMessage', m.text);
    await chats[i].save();
  } 
} catch (error) {
  throw new Error(error);
}

})();