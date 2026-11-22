// npm run seed       -> creates the admin user + the tours
// npm run seed:demo  -> same, plus 28 sample orders (so the panel isn't empty)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../src/models/Admin.js';
import Tour from '../src/models/Tour.js';
import Order from '../src/models/Order.js';

const { MONGODB_URI, MONGODB_DB = 'utopia', ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'ადმინი' } = process.env;
const DEMO = process.argv.includes('--demo');

if (!MONGODB_URI) throw new Error('MONGODB_URI is missing in .env.local');
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('ADMIN_EMAIL / ADMIN_PASSWORD are missing in .env.local');

const TOURS = [
  { slug: 'beyond-time', title: 'დროის მიღმა', place: 'კაირო · გიზა · შარმ-ელ-შეიხი', price: 7777, date: '20–26 დეკ', seats: 30 },
  { slug: 'beyond-the-stars', title: 'ვარსკვლავების მიღმა', place: 'სინაის უდაბნო · შარმ-ელ-შეიხი', price: 4900, date: 'იანვარი', seats: 20 },
  { slug: 'footsteps-of-pharaohs', title: 'ფარაონების კვალდაკვალ', place: 'კაირო · გიზა · საკარა', price: 5200, date: 'თებერვალი', seats: 24 },
  { slug: 'red-sea-silence', title: 'წითელი ზღვის სიჩუმე', place: 'შარმ-ელ-შეიხი', price: 4500, date: 'მარტი', seats: 24 },
  { slug: 'nile-legends', title: 'ნილოსის ლეგენდები', place: 'ლუქსორი · ასუანი · ნილოსი', price: 6900, date: 'აპრილი', seats: 20 },
  { slug: 'desert-spirit', title: 'უდაბნოს სულისკვეთება', place: 'სივას ოაზისი', price: 5600, date: 'მაისი', seats: 16 },
];

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  console.log('✓ connected to', MONGODB_DB);

  // admin user (password is stored only as a bcrypt hash)
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { email: ADMIN_EMAIL.toLowerCase(), name: ADMIN_NAME, passwordHash },
    { upsert: true }
  );
  console.log('✓ admin:', ADMIN_EMAIL);

  // tours
  for (const [i, t] of TOURS.entries()) {
    await Tour.findOneAndUpdate({ slug: t.slug }, { ...t, order: i }, { upsert: true });
  }
  const tours = await Tour.find().sort({ order: 1 });
  console.log('✓ tours:', tours.length);

  if (DEMO) await demoOrders(tours);

  await mongoose.disconnect();
  console.log('done');
}

async function demoOrders(tours) {
  await Order.deleteMany({ ref: /^UT-DEMO-/ });
  const FN = ['ნინო', 'გიორგი', 'ანა', 'ლუკა', 'მარიამ', 'დავით', 'სალომე', 'ნიკა', 'თამარ', 'ლევან', 'ეკა', 'ირაკლი', 'ქეთი', 'საბა', 'მაკა', 'ზურა'];
  const LN = ['ბერიძე', 'კაპანაძე', 'გელაშვილი', 'მაისურაძე', 'ლომიძე', 'ჩიქოვანი', 'ხარაიშვილი', 'ნოზაძე', 'წიკლაური', 'ჯაფარიძე', 'მესხი', 'ქავთარაძე'];
  let seed = 11;
  const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const pick = (a) => a[Math.floor(r() * a.length)];
  const two = () => String(10 + Math.floor(r() * 89));
  const now = Date.now();

  const docs = [];
  for (let i = 0; i < 28; i++) {
    const tour = r() < 0.45 ? tours[0] : pick(tours);
    const people = 1 + Math.floor(Math.pow(r(), 1.6) * 5);
    const method = r() < 0.6 ? 'card' : r() < 0.65 ? 'split' : 'later';
    const status =
      method === 'card' ? (r() < 0.88 ? 'paid' : r() < 0.6 ? 'failed' : 'refunded')
      : method === 'split' ? (r() < 0.7 ? 'paid' : 'pending')
      : r() < 0.45 ? 'paid' : 'pending';
    const at = new Date(now - Math.floor(Math.pow(r(), 1.3) * 14 * 24) * 36e5 - Math.floor(r() * 60) * 6e4);
    const bank = pick(['საქართველოს ბანკი', 'თიბისი']);
    const later = (ms) => new Date(+at + ms);

    const history = [{ label: 'შეკვეთა შეიქმნა', state: 'done', at }];
    if (method === 'card') {
      history.push({ label: 'ბანკის გვერდზე გადასვლა', state: 'done', at: later(6e4) });
      history.push(status === 'failed'
        ? { label: 'გადახდა უარყოფილია', note: 'ბანკი: არასაკმარისი თანხა', state: 'fail', at: later(3e5) }
        : { label: 'გადახდა დადასტურდა', state: 'done', at: later(3e5) });
    }
    if (method === 'split') {
      history.push({ label: 'განვადების განაცხადი გაიგზავნა', note: bank, state: 'done', at: later(6e4) });
      history.push(status === 'paid'
        ? { label: 'ბანკმა დაადასტურა', state: 'done', at: later(72e5) }
        : { label: 'ბანკის პასუხის მოლოდინში', note: 'ჩვეულებრივ 1-2 სამუშაო დღე', state: 'now', at: later(6e4) });
    }
    if (method === 'later') {
      history.push(status === 'paid'
        ? { label: 'მენეჯერმა დაადასტურა', note: 'გადახდა მიღებულია', state: 'done', at: later(36e5) }
        : { label: 'დასაკავშირებელია', note: 'მომხმარებელი ელოდება ზარს', state: 'now', at });
    }
    if (status === 'refunded') history.push({ label: 'თანხა დაბრუნდა', note: 'ბარათზე', state: 'done', at: later(864e5) });

    docs.push({
      ref: 'UT-DEMO-' + (482100 + i * 37),
      firstName: pick(FN),
      lastName: pick(LN),
      phone: `+995 5${50 + Math.floor(r() * 49)} ${two()} ${two()} ${two()}`,
      personalId: String(Math.floor(1e10 + r() * 8.9e10)),
      tour: tour._id,
      people,
      total: tour.price * people,
      method,
      status,
      bank: method === 'split' ? bank : '',
      months: method === 'split' ? pick([6, 12, 18]) : 0,
      history,
      createdAt: at,
      updatedAt: at,
    });
  }
  await Order.insertMany(docs);
  console.log('✓ demo orders:', docs.length, '(refs start with UT-DEMO-)');
}

main().catch(async (err) => {
  console.error('✗', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
