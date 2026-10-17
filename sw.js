// 📱 Այս փոքրիկ աշխատողը կայքը դարձնում է «հավելված»՝
// հեռախոսի էկրանին պատկերակով բացվող։ Ոչինչ չի պահում հիշողության մեջ,
// որ նոր խաղերը միշտ թարմ գան — միայն հարցումը փոխանցում է ցանցին։
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
