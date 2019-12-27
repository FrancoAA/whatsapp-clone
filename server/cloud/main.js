// Cloud Code entry point

Parse.Cloud.define('getContacts', async (request) => {
  const query = new Parse.Query('User');
  const results = await query.find();
  return results;
});

Parse.Cloud.define('sendMessage', async(request) => {
  try {

    const user = request.user;
    console.log('User: ', user);

    if (!user) {
      throw new Error('You must be logged in to send a message');
    }

    const { chatId, message } = request.params;
    const query = new Parse.Query('Chats');
    const chat = await query.get(chatId);

    console.log('Chat:', chat);

    if (!chat) {
      throw new Error(`the conversation with id = ${request.params.chatId} doesn't exist.`);
    }

    const newMessage = new Parse.Object('Messages');
    newMessage.set('chatId', chatId);
    newMessage.set('text', message);
    newMessage.set('sender', user);
    await newMessage.save();

    // Update last message info
    chat.set('lastMessage', newMessage);
    await chat.save();

    return newMessage;
  } catch (error) {
    throw new Error(error);
  }
});