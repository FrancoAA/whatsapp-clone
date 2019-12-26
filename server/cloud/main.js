// Cloud Code entry point

Parse.Cloud.define('getContacts', async (request) => {
  const query = new Parse.Query('User');
  const results = await query.find();
  return results;
});

Parse.Cloud.define('sendMessage', async(request) => {
  const Message = new Parse.extend('Messages');
  try {

    const user = request.user;
    if (!user) {
      throw new Error('You must be logged in to send a message');
    }

    const { chatId, message } = request.params;
    const query = Parse.Query('Chats');
    const chat = await query.get(chatId);
    if (chat) {
      throw new Error(`the conversation with id = ${request.params.chatId} doesn't exist.`);
    }

    const newMessage = new Message();
    newMessage.set('chatId', chatId);
    newMessage.set('text', message);
    newMessage.set('sender', user);
  } catch (error) {
    throw new Error(error);
  }
});