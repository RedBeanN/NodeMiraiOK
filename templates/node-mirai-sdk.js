const Mirai = require('node-mirai-sdk');
const { Plain, At } = Mirai.MessageComponent;

//服务端设置(*)
const bot = new Mirai({
  host: 'http://your.host.name:port', // your server host
  authKey: 'YourAuthKey',
  qq: 123456, // your qq
  enableWebsocket: false,
});

//auth认证(*)
bot.onSignal('authed', () => {
  console.log(`Authed with session key ${bot.sessionKey}`);
  bot.verify();
});

//获取好友列表
bot.onSignal('verified', async () => {
  console.log(`Verified with session key ${bot.sessionKey}`);
  const friendList = await bot.getFriendList();
  console.log(`There are ${friendList.length} friends in bot`);
});

//接受消息,发送消息(*)
bot.onMessage(message => {
  const { type, sender, messageChain, reply, quoteReply } = message;
  let msg = '';
  messageChain.forEach(chain => {
    if (chain.type === 'Plain') msg += Plain.value(chain);
  });
  // 直接回复
  if (msg.includes('收到了吗')) reply('收到了收到了'); // 或者: bot.reply('收到了', message)
  // 引用回复
  else if (msg.includes('引用我')) bot.quoteReply([At(sender.id), Plain('好的')], message); // 或者: bot.reply([...], message, true)
  // 撤回
  else if (msg.includes('撤回')) bot.recall(message);
});

/* 开始监听消息(*)
 * 'all' - 监听好友和群
 * 'friend' - 只监听好友
 * 'group' - 只监听群
 * 'temp' - 只监听临时会话
*/
bot.listen('all');

process.on('exit', () => {
  bot.release();
});