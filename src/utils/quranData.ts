import { QuranAyah, QuranSurah } from '../types';

export const SURAHS_CATALOG: QuranSurah[] = [
  { number: 1, nameAr: 'الفاتحة', nameTr: 'Fâtiha', transliteration: 'Al-Fatiha', englishName: 'The Opening', versesCount: 7, revelationType: 'Meccan', juzStart: 1 },
  { number: 2, nameAr: 'البقرة', nameTr: 'Bakara', transliteration: 'Al-Baqarah', englishName: 'The Cow', versesCount: 286, revelationType: 'Medinan', juzStart: 1 },
  { number: 3, nameAr: 'آل عمران', nameTr: 'Âl-i İmrân', transliteration: 'Ali \'Imran', englishName: 'Family of Imran', versesCount: 200, revelationType: 'Medinan', juzStart: 3 },
  { number: 4, nameAr: 'النساء', nameTr: 'Nisâ', transliteration: 'An-Nisa', englishName: 'The Women', versesCount: 176, revelationType: 'Medinan', juzStart: 4 },
  { number: 5, nameAr: 'المائدة', nameTr: 'Mâide', transliteration: 'Al-Ma\'idah', englishName: 'The Table Spread', versesCount: 120, revelationType: 'Medinan', juzStart: 6 },
  { number: 6, nameAr: 'الأنعام', nameTr: 'En\'âm', transliteration: 'Al-An\'am', englishName: 'The Cattle', versesCount: 165, revelationType: 'Meccan', juzStart: 7 },
  { number: 7, nameAr: 'الأعراف', nameTr: 'A\'râf', transliteration: 'Al-A\'raf', englishName: 'The Heights', versesCount: 206, revelationType: 'Meccan', juzStart: 8 },
  { number: 8, nameAr: 'الأنفال', nameTr: 'Enfâl', transliteration: 'Al-Anfal', englishName: 'The Spoils of War', versesCount: 75, revelationType: 'Medinan', juzStart: 9 },
  { number: 9, nameAr: 'التوبة', nameTr: 'Tevbe', transliteration: 'At-Tawbah', englishName: 'The Repentance', versesCount: 129, revelationType: 'Medinan', juzStart: 10 },
  { number: 10, nameAr: 'يونس', nameTr: 'Yûnus', transliteration: 'Yunus', englishName: 'Jonah', versesCount: 109, revelationType: 'Meccan', juzStart: 11 },
  { number: 11, nameAr: 'هود', nameTr: 'Hûd', transliteration: 'Hud', englishName: 'Hud', versesCount: 123, revelationType: 'Meccan', juzStart: 11 },
  { number: 12, nameAr: 'يوسف', nameTr: 'Yûsuf', transliteration: 'Yusuf', englishName: 'Joseph', versesCount: 111, revelationType: 'Meccan', juzStart: 12 },
  { number: 13, nameAr: 'الرعد', nameTr: 'Ra\'d', transliteration: 'Ar-Ra\'d', englishName: 'The Thunder', versesCount: 43, revelationType: 'Medinan', juzStart: 13 },
  { number: 14, nameAr: 'إبراهيم', nameTr: 'İbrâhîm', transliteration: 'Ibrahim', englishName: 'Abraham', versesCount: 52, revelationType: 'Meccan', juzStart: 13 },
  { number: 15, nameAr: 'الحجر', nameTr: 'Hicr', transliteration: 'Al-Hijr', englishName: 'The Rocky Tract', versesCount: 99, revelationType: 'Meccan', juzStart: 14 },
  { number: 16, nameAr: 'النحل', nameTr: 'Nahl', transliteration: 'An-Nahl', englishName: 'The Bee', versesCount: 128, revelationType: 'Meccan', juzStart: 14 },
  { number: 17, nameAr: 'الإسراء', nameTr: 'İsrâ', transliteration: 'Al-Isra', englishName: 'The Night Journey', versesCount: 111, revelationType: 'Meccan', juzStart: 15 },
  { number: 18, nameAr: 'الكهف', nameTr: 'Kehf', transliteration: 'Al-Kahf', englishName: 'The Cave', versesCount: 110, revelationType: 'Meccan', juzStart: 15 },
  { number: 19, nameAr: 'مريم', nameTr: 'Meryem', transliteration: 'Maryam', englishName: 'Mary', versesCount: 98, revelationType: 'Meccan', juzStart: 16 },
  { number: 20, nameAr: 'طه', nameTr: 'Tâhâ', transliteration: 'Taha', englishName: 'Ta-Ha', versesCount: 135, revelationType: 'Meccan', juzStart: 16 },
  { number: 21, nameAr: 'الأنبياء', nameTr: 'Enbiyâ', transliteration: 'Al-Anbiya', englishName: 'The Prophets', versesCount: 112, revelationType: 'Meccan', juzStart: 17 },
  { number: 22, nameAr: 'الحج', nameTr: 'Hac', transliteration: 'Al-Hajj', englishName: 'The Pilgrimage', versesCount: 78, revelationType: 'Medinan', juzStart: 17 },
  { number: 23, nameAr: 'المؤمنون', nameTr: 'Mü\'minûn', transliteration: 'Al-Mu\'minun', englishName: 'The Believers', versesCount: 118, revelationType: 'Meccan', juzStart: 18 },
  { number: 24, nameAr: 'النور', nameTr: 'Nûr', transliteration: 'An-Nur', englishName: 'The Light', versesCount: 64, revelationType: 'Medinan', juzStart: 18 },
  { number: 25, nameAr: 'الفرقان', nameTr: 'Furkan', transliteration: 'Al-Furqan', englishName: 'The Criterion', versesCount: 77, revelationType: 'Meccan', juzStart: 18 },
  { number: 26, nameAr: 'الشعراء', nameTr: 'Şuarâ', transliteration: 'Ash-Shu\'ara', englishName: 'The Poets', versesCount: 227, revelationType: 'Meccan', juzStart: 19 },
  { number: 27, nameAr: 'النمل', nameTr: 'Neml', transliteration: 'An-Naml', englishName: 'The Ant', versesCount: 93, revelationType: 'Meccan', juzStart: 19 },
  { number: 28, nameAr: 'القصص', nameTr: 'Kasas', transliteration: 'Al-Qasas', englishName: 'The Stories', versesCount: 88, revelationType: 'Meccan', juzStart: 20 },
  { number: 29, nameAr: 'العنكبوت', nameTr: 'Ankebût', transliteration: 'Al-\'Ankabut', englishName: 'The Spider', versesCount: 69, revelationType: 'Meccan', juzStart: 20 },
  { number: 30, nameAr: 'الروم', nameTr: 'Rûm', transliteration: 'Ar-Rum', englishName: 'The Romans', versesCount: 60, revelationType: 'Meccan', juzStart: 21 },
  { number: 31, nameAr: 'لقمان', nameTr: 'Lokmân', transliteration: 'Luqman', englishName: 'Luqman', versesCount: 34, revelationType: 'Meccan', juzStart: 21 },
  { number: 32, nameAr: 'السجدة', nameTr: 'Secde', transliteration: 'As-Sajdah', englishName: 'The Prostration', versesCount: 30, revelationType: 'Meccan', juzStart: 21 },
  { number: 33, nameAr: 'الأحزاب', nameTr: 'Ahzâb', transliteration: 'Al-Ahzab', englishName: 'The Combined Forces', versesCount: 73, revelationType: 'Medinan', juzStart: 21 },
  { number: 34, nameAr: 'سبأ', nameTr: 'Sebe\'', transliteration: 'Saba', englishName: 'Sheba', versesCount: 54, revelationType: 'Meccan', juzStart: 22 },
  { number: 35, nameAr: 'فاطر', nameTr: 'Fâtır', transliteration: 'Fatir', englishName: 'The Originator', versesCount: 45, revelationType: 'Meccan', juzStart: 22 },
  { number: 36, nameAr: 'يس', nameTr: 'Yâsîn', transliteration: 'Ya-Sin', englishName: 'Ya Sin', versesCount: 83, revelationType: 'Meccan', juzStart: 22 },
  { number: 37, nameAr: 'الصافات', nameTr: 'Sâffât', transliteration: 'As-Saffat', englishName: 'Those Who Set The Ranks', versesCount: 182, revelationType: 'Meccan', juzStart: 23 },
  { number: 38, nameAr: 'ص', nameTr: 'Sâd', transliteration: 'Sad', englishName: 'The Letter "Saad"', versesCount: 88, revelationType: 'Meccan', juzStart: 23 },
  { number: 39, nameAr: 'الزمر', nameTr: 'Zümer', transliteration: 'Az-Zumar', englishName: 'The Troops', versesCount: 75, revelationType: 'Meccan', juzStart: 23 },
  { number: 40, nameAr: 'غافر', nameTr: 'Mü\'min (Gâfir)', transliteration: 'Ghafir', englishName: 'The Forgiver', versesCount: 85, revelationType: 'Meccan', juzStart: 24 },
  { number: 41, nameAr: 'فصلت', nameTr: 'Fussilet', transliteration: 'Fussilat', englishName: 'Explained in Detail', versesCount: 54, revelationType: 'Meccan', juzStart: 24 },
  { number: 42, nameAr: 'الشورى', nameTr: 'Şûrâ', transliteration: 'Ash-Shura', englishName: 'The Consultation', versesCount: 53, revelationType: 'Meccan', juzStart: 25 },
  { number: 43, nameAr: 'الزخرف', nameTr: 'Zuhruf', transliteration: 'Az-Zukhruf', englishName: 'The Ornaments of Gold', versesCount: 89, revelationType: 'Meccan', juzStart: 25 },
  { number: 44, nameAr: 'الدخان', nameTr: 'Duhân', transliteration: 'Ad-Dukhan', englishName: 'The Smoke', versesCount: 59, revelationType: 'Meccan', juzStart: 25 },
  { number: 45, nameAr: 'الجاثية', nameTr: 'Câsiye', transliteration: 'Al-Jathiyah', englishName: 'The Crouching', versesCount: 37, revelationType: 'Meccan', juzStart: 25 },
  { number: 46, nameAr: 'الأحقاف', nameTr: 'Ahkâf', transliteration: 'Al-Ahqaf', englishName: 'The Wind-Curved Sandhills', versesCount: 35, revelationType: 'Meccan', juzStart: 26 },
  { number: 47, nameAr: 'محمد', nameTr: 'Muhammed', transliteration: 'Muhammad', englishName: 'Muhammad', versesCount: 38, revelationType: 'Medinan', juzStart: 26 },
  { number: 48, nameAr: 'الفتح', nameTr: 'Fetih', transliteration: 'Al-Fath', englishName: 'The Victory', versesCount: 29, revelationType: 'Medinan', juzStart: 26 },
  { number: 49, nameAr: 'الحجرات', nameTr: 'Hucurât', transliteration: 'Al-Hujurat', englishName: 'The Rooms', versesCount: 18, revelationType: 'Medinan', juzStart: 26 },
  { number: 50, nameAr: 'ق', nameTr: 'Kâf', transliteration: 'Qaf', englishName: 'The Letter "Qaf"', versesCount: 45, revelationType: 'Meccan', juzStart: 26 },
  { number: 51, nameAr: 'الذاريات', nameTr: 'Zâriyât', transliteration: 'Adh-Dhariyat', englishName: 'The Winnowing Winds', versesCount: 60, revelationType: 'Meccan', juzStart: 26 },
  { number: 52, nameAr: 'الطور', nameTr: 'Tûr', transliteration: 'At-Tur', englishName: 'The Mount', versesCount: 49, revelationType: 'Meccan', juzStart: 27 },
  { number: 53, nameAr: 'النجم', nameTr: 'Necm', transliteration: 'An-Najm', englishName: 'The Star', versesCount: 62, revelationType: 'Meccan', juzStart: 27 },
  { number: 54, nameAr: 'القمر', nameTr: 'Kamer', transliteration: 'Al-Qamar', englishName: 'The Moon', versesCount: 55, revelationType: 'Meccan', juzStart: 27 },
  { number: 55, nameAr: 'الرحمن', nameTr: 'Rahmân', transliteration: 'Ar-Rahman', englishName: 'The Beneficent', versesCount: 78, revelationType: 'Medinan', juzStart: 27 },
  { number: 56, nameAr: 'الواقعة', nameTr: 'Vâkıa', transliteration: 'Al-Waqi\'ah', englishName: 'The Inevitable', versesCount: 96, revelationType: 'Meccan', juzStart: 27 },
  { number: 57, nameAr: 'الحديد', nameTr: 'Hadîd', transliteration: 'Al-Hadid', englishName: 'The Iron', versesCount: 29, revelationType: 'Medinan', juzStart: 27 },
  { number: 58, nameAr: 'المجادلة', nameTr: 'Mücâdele', transliteration: 'Al-Mujadila', englishName: 'The Pleading Woman', versesCount: 22, revelationType: 'Medinan', juzStart: 28 },
  { number: 59, nameAr: 'الحشر', nameTr: 'Haşr', transliteration: 'Al-Hashr', englishName: 'The Exile', versesCount: 24, revelationType: 'Medinan', juzStart: 28 },
  { number: 60, nameAr: 'الممتحنة', nameTr: 'Mümtehine', transliteration: 'Al-Mumtahanah', englishName: 'She That Is To Be Examined', versesCount: 13, revelationType: 'Medinan', juzStart: 28 },
  { number: 61, nameAr: 'الصف', nameTr: 'Saff', transliteration: 'As-Saff', englishName: 'The Ranks', versesCount: 14, revelationType: 'Medinan', juzStart: 28 },
  { number: 62, nameAr: 'الجمعة', nameTr: 'Cuma', transliteration: 'Al-Jumu\'ah', englishName: 'The Congregation', versesCount: 11, revelationType: 'Medinan', juzStart: 28 },
  { number: 63, nameAr: 'المنافقون', nameTr: 'Münâfikûn', transliteration: 'Al-Munafiqun', englishName: 'The Hypocrites', versesCount: 11, revelationType: 'Medinan', juzStart: 28 },
  { number: 64, nameAr: 'التغابن', nameTr: 'Teğâbün', transliteration: 'At-Taghabun', englishName: 'The Mutual Disillusion', versesCount: 18, revelationType: 'Medinan', juzStart: 28 },
  { number: 65, nameAr: 'الطلاق', nameTr: 'Talâk', transliteration: 'At-Talaq', englishName: 'The Divorce', versesCount: 12, revelationType: 'Medinan', juzStart: 28 },
  { number: 66, nameAr: 'التحريم', nameTr: 'Tahrîm', transliteration: 'At-Tahrim', englishName: 'The Prohibition', versesCount: 12, revelationType: 'Medinan', juzStart: 28 },
  { number: 67, nameAr: 'الملك', nameTr: 'Mülk', transliteration: 'Al-Mulk', englishName: 'The Sovereignty', versesCount: 30, revelationType: 'Meccan', juzStart: 29 },
  { number: 68, nameAr: 'القلم', nameTr: 'Kalem', transliteration: 'Al-Qalam', englishName: 'The Pen', versesCount: 52, revelationType: 'Meccan', juzStart: 29 },
  { number: 69, nameAr: 'الحاقة', nameTr: 'Hâkka', transliteration: 'Al-Haqqah', englishName: 'The Reality', versesCount: 52, revelationType: 'Meccan', juzStart: 29 },
  { number: 70, nameAr: 'المعارج', nameTr: 'Meâric', transliteration: 'Al-Ma\'arij', englishName: 'The Ascending Stairways', versesCount: 44, revelationType: 'Meccan', juzStart: 29 },
  { number: 71, nameAr: 'نوح', nameTr: 'Nûh', transliteration: 'Nuh', englishName: 'Noah', versesCount: 28, revelationType: 'Meccan', juzStart: 29 },
  { number: 72, nameAr: 'الجن', nameTr: 'Cin', transliteration: 'Al-Jinn', englishName: 'The Jinn', versesCount: 28, revelationType: 'Meccan', juzStart: 29 },
  { number: 73, nameAr: 'المزمل', nameTr: 'Müzzemmil', transliteration: 'Al-Muzzammil', englishName: 'The Enshrouded One', versesCount: 20, revelationType: 'Meccan', juzStart: 29 },
  { number: 74, nameAr: 'المدثر', nameTr: 'Müddessir', transliteration: 'Al-Muddaththir', englishName: 'The Cloaked One', versesCount: 56, revelationType: 'Meccan', juzStart: 29 },
  { number: 75, nameAr: 'القيامة', nameTr: 'Kıyâme', transliteration: 'Al-Qiyamah', englishName: 'The Resurrection', versesCount: 40, revelationType: 'Meccan', juzStart: 29 },
  { number: 76, nameAr: 'الإنسان', nameTr: 'İnsân', transliteration: 'Al-Insan', englishName: 'The Human', versesCount: 31, revelationType: 'Medinan', juzStart: 29 },
  { number: 77, nameAr: 'المرسلات', nameTr: 'Mürselât', transliteration: 'Al-Mursalat', englishName: 'The Emissaries', versesCount: 50, revelationType: 'Meccan', juzStart: 29 },
  { number: 78, nameAr: 'النبأ', nameTr: 'Nebe\'', transliteration: 'An-Naba', englishName: 'The Tidings', versesCount: 40, revelationType: 'Meccan', juzStart: 30 },
  { number: 79, nameAr: 'النازعات', nameTr: 'Nâziât', transliteration: 'An-Nazi\'at', englishName: 'Those Who Drag Forth', versesCount: 46, revelationType: 'Meccan', juzStart: 30 },
  { number: 80, nameAr: 'عبس', nameTr: 'Abese', transliteration: '\'Abasa', englishName: 'He Frowned', versesCount: 42, revelationType: 'Meccan', juzStart: 30 },
  { number: 81, nameAr: 'التكوير', nameTr: 'Tekvîr', transliteration: 'At-Takwir', englishName: 'The Overthrowing', versesCount: 29, revelationType: 'Meccan', juzStart: 30 },
  { number: 82, nameAr: 'الانفطار', nameTr: 'İnfitâr', transliteration: 'Al-Infitar', englishName: 'The Cleaving', versesCount: 19, revelationType: 'Meccan', juzStart: 30 },
  { number: 83, nameAr: 'المطففين', nameTr: 'Mutaffifîn', transliteration: 'Al-Mutaffifin', englishName: 'The Defrauding', versesCount: 36, revelationType: 'Meccan', juzStart: 30 },
  { number: 84, nameAr: 'الانشقاق', nameTr: 'İnşikâk', transliteration: 'Al-Inshiqaq', englishName: 'The Splitting Open', versesCount: 25, revelationType: 'Meccan', juzStart: 30 },
  { number: 85, nameAr: 'البروج', nameTr: 'Bürûc', transliteration: 'Al-Buruj', englishName: 'The Mansions of the Stars', versesCount: 22, revelationType: 'Meccan', juzStart: 30 },
  { number: 86, nameAr: 'الطارق', nameTr: 'Târık', transliteration: 'At-Tariq', englishName: 'The Morning Star', versesCount: 17, revelationType: 'Meccan', juzStart: 30 },
  { number: 87, nameAr: 'الأعلى', nameTr: 'A\'lâ', transliteration: 'Al-A\'la', englishName: 'The Most High', versesCount: 19, revelationType: 'Meccan', juzStart: 30 },
  { number: 88, nameAr: 'الغاشية', nameTr: 'Gâşiye', transliteration: 'Al-Ghashiyah', englishName: 'The Overwhelming', versesCount: 26, revelationType: 'Meccan', juzStart: 30 },
  { number: 89, nameAr: 'الفجر', nameTr: 'Fecr', transliteration: 'Al-Fajr', englishName: 'The Dawn', versesCount: 30, revelationType: 'Meccan', juzStart: 30 },
  { number: 90, nameAr: 'البلد', nameTr: 'Beled', transliteration: 'Al-Balad', englishName: 'The City', versesCount: 20, revelationType: 'Meccan', juzStart: 30 },
  { number: 91, nameAr: 'الشمس', nameTr: 'Şems', transliteration: 'Ash-Shams', englishName: 'The Sun', versesCount: 15, revelationType: 'Meccan', juzStart: 30 },
  { number: 92, nameAr: 'الليل', nameTr: 'Leyl', transliteration: 'Al-Layl', englishName: 'The Night', versesCount: 21, revelationType: 'Meccan', juzStart: 30 },
  { number: 93, nameAr: 'الضحى', nameTr: 'Duhâ', transliteration: 'Ad-Duhaa', englishName: 'The Morning Hours', versesCount: 11, revelationType: 'Meccan', juzStart: 30 },
  { number: 94, nameAr: 'الشرح', nameTr: 'İnşirâh', transliteration: 'Ash-Sharh', englishName: 'The Relief', versesCount: 8, revelationType: 'Meccan', juzStart: 30 },
  { number: 95, nameAr: 'التين', nameTr: 'Tîn', transliteration: 'At-Tin', englishName: 'The Fig', versesCount: 8, revelationType: 'Meccan', juzStart: 30 },
  { number: 96, nameAr: 'العلق', nameTr: 'Alak', transliteration: 'Al-\'Alaq', englishName: 'The Clot', versesCount: 19, revelationType: 'Meccan', juzStart: 30 },
  { number: 97, nameAr: 'القدر', nameTr: 'Kadir', transliteration: 'Al-Qadr', englishName: 'The Power', versesCount: 5, revelationType: 'Meccan', juzStart: 30 },
  { number: 98, nameAr: 'البينة', nameTr: 'Beyyine', transliteration: 'Al-Bayyinah', englishName: 'The Clear Proof', versesCount: 8, revelationType: 'Medinan', juzStart: 30 },
  { number: 99, nameAr: 'الزلزلة', nameTr: 'Zilzâl', transliteration: 'Az-Zalzalah', englishName: 'The Earthquake', versesCount: 8, revelationType: 'Medinan', juzStart: 30 },
  { number: 100, nameAr: 'العاديات', nameTr: 'Âdiyât', transliteration: 'Al-\'Adiyat', englishName: 'The Courser', versesCount: 11, revelationType: 'Meccan', juzStart: 30 },
  { number: 101, nameAr: 'القارعة', nameTr: 'Kâria', transliteration: 'Al-Qari\'ah', englishName: 'The Calamity', versesCount: 11, revelationType: 'Meccan', juzStart: 30 },
  { number: 102, nameAr: 'التكاثر', nameTr: 'Tekâsür', transliteration: 'At-Takathur', englishName: 'The Rivalry in World Increase', versesCount: 8, revelationType: 'Meccan', juzStart: 30 },
  { number: 103, nameAr: 'العصر', nameTr: 'Asr', transliteration: 'Al-\'Asr', englishName: 'The Declining Day', versesCount: 3, revelationType: 'Meccan', juzStart: 30 },
  { number: 104, nameAr: 'الهمزة', nameTr: 'Hümeze', transliteration: 'Al-Humazah', englishName: 'The Traducer', versesCount: 9, revelationType: 'Meccan', juzStart: 30 },
  { number: 105, nameAr: 'الفيل', nameTr: 'Fîl', transliteration: 'Al-Fil', englishName: 'The Elephant', versesCount: 5, revelationType: 'Meccan', juzStart: 30 },
  { number: 106, nameAr: 'قريش', nameTr: 'Kureyş', transliteration: 'Quraysh', englishName: 'Quraysh', versesCount: 4, revelationType: 'Meccan', juzStart: 30 },
  { number: 107, nameAr: 'الماعون', nameTr: 'Mâûn', transliteration: 'Al-Ma\'un', englishName: 'The Small Kindness', versesCount: 7, revelationType: 'Meccan', juzStart: 30 },
  { number: 108, nameAr: 'الكوثر', nameTr: 'Kevser', transliteration: 'Al-Kawthar', englishName: 'The Abundance', versesCount: 3, revelationType: 'Meccan', juzStart: 30 },
  { number: 109, nameAr: 'الكافرون', nameTr: 'Kâfirûn', transliteration: 'Al-Kafirun', englishName: 'The Disbelievers', versesCount: 6, revelationType: 'Meccan', juzStart: 30 },
  { number: 110, nameAr: 'النصر', nameTr: 'Nasr', transliteration: 'An-Nasr', englishName: 'The Divine Support', versesCount: 3, revelationType: 'Medinan', juzStart: 30 },
  { number: 111, nameAr: 'المسد', nameTr: 'Tebbet (Mesed)', transliteration: 'Al-Masad', englishName: 'The Palm Fiber', versesCount: 5, revelationType: 'Meccan', juzStart: 30 },
  { number: 112, nameAr: 'الإخلاص', nameTr: 'İhlâs', transliteration: 'Al-Ikhlas', englishName: 'The Sincerity', versesCount: 4, revelationType: 'Meccan', juzStart: 30 },
  { number: 113, nameAr: 'الفلق', nameTr: 'Felak', transliteration: 'Al-Falaq', englishName: 'The Daybreak', versesCount: 5, revelationType: 'Meccan', juzStart: 30 },
  { number: 114, nameAr: 'الناس', nameTr: 'Nâs', transliteration: 'An-Nas', englishName: 'Mankind', versesCount: 6, revelationType: 'Meccan', juzStart: 30 },
];

// Rich predefined offline cache for immediate high-speed loading
export const PREDEFINED_SURAHS_VERSES: Record<number, QuranAyah[]> = {
  // Surah 1: Al-Fatihah
  1: [
    {
      numberInSurah: 1,
      numberInQuran: 1,
      textAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translationTr: 'Rahmân ve Rahîm olan Allah\'ın adıyla.',
      tafsirAr: 'أبتدئ قراءتي مستعيناً بالله، الرحمن: ذي الرحمة الواسعة، الرحيم: الموصل رحمته لمن يشاء من عباده.',
      juz: 1,
      page: 1,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
    },
    {
      numberInSurah: 2,
      numberInQuran: 2,
      textAr: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translationTr: 'Hamd (övme ve övülme), âlemlerin Rabbi olan Allah\'a aittir.',
      tafsirAr: 'الثناء الكامل لله تعالى وحده بصفات كماله، وبنعمه الظاهرة والباطنة، مربي جميع خلقه بنعمه.',
      juz: 1,
      page: 1,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001002.mp3',
    },
    {
      numberInSurah: 3,
      numberInQuran: 3,
      textAr: 'الرَّحْمَٰنِ الرَّحِيمِ',
      translationTr: 'O, Rahmân\'dır, Rahîm\'dir.',
      tafsirAr: 'رحمن الدنيا والآخرة ورحيمهما، ذو الرحمة العظيمة الشاملة.',
      juz: 1,
      page: 1,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001003.mp3',
    },
    {
      numberInSurah: 4,
      numberInQuran: 4,
      textAr: 'مَالِكِ يَوْمِ الدِّينِ',
      translationTr: 'Ceza ve hesap gününün (ahiret gününün) tek sahibidir.',
      tafsirAr: 'المالك المتصرف في يوم الجزاء والحساب، وهو يوم القيامة.',
      juz: 1,
      page: 1,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001004.mp3',
    },
    {
      numberInSurah: 5,
      numberInQuran: 5,
      textAr: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      translationTr: '(Rabbimiz!) Ancak sana kulluk eder ve yalnız senden yardım dileriz.',
      tafsirAr: 'نخصك وحدك بالعبادة والطاعة، ونستعين بك وحدك في جميع أمورنا.',
      juz: 1,
      page: 1,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001005.mp3',
    },
    {
      numberInSurah: 6,
      numberInQuran: 6,
      textAr: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      translationTr: 'Bizi doğru yola ilet;',
      tafsirAr: 'دلنا وأرشدنا ووفقنا وثبتنا على الطريق المستقيم الواضح الموصل إلى مرضاتك وجنتك.',
      juz: 1,
      page: 1,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001006.mp3',
    },
    {
      numberInSurah: 7,
      numberInQuran: 7,
      textAr: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      translationTr: 'Kendilerine lütuf ve ikramda bulunduğun kimselerin yoluna; gazaba uğramışların ve sapmışların yoluna değil!',
      tafsirAr: 'طريق النبيين والصدّيقين والشهداء والصالحين، غير طريق المغضوب عليهم (كاليهود الذين عرفوا الحق وتركوه)، ولا طريق الضالين (كالنصارى الذين فقدوا الحق وعبدوا بجهل).',
      juz: 1,
      page: 1,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3',
    },
  ],

  // Surah 112: Al-Ikhlas
  112: [
    {
      numberInSurah: 1,
      numberInQuran: 6222,
      textAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translationTr: 'De ki: O Allah tektir.',
      tafsirAr: 'قل أيها الرسول لمن سألك عن ربك: هو الله المتفرد بالكمال والألوهية، ليس له شريك.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3',
    },
    {
      numberInSurah: 2,
      numberInQuran: 6223,
      textAr: 'اللَّهُ الصَّمَدُ',
      translationTr: 'Allah Samed\'dir (Her şey O\'na muhtaç, O hiçbir şeye muhtaç değildir).',
      tafsirAr: 'المقصود في قضاء الحوائج والرغائب، الكامل في سيادته وشرفه وغناه وعظمته.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112002.mp3',
    },
    {
      numberInSurah: 3,
      numberInQuran: 6224,
      textAr: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      translationTr: 'O doğurmamış ve doğmamıştır.',
      tafsirAr: 'ليس له ولد ولا والد ولا صاحبة تنزه وتقدس عن كل نقص.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112003.mp3',
    },
    {
      numberInSurah: 4,
      numberInQuran: 6225,
      textAr: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      translationTr: 'Hiçbir şey O\'nun dengi ve benzeri olamaz.',
      tafsirAr: 'ولم يكن له مماثل ولا نظير في أسمائه وصفاته وأفعاله.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112004.mp3',
    },
  ],

  // Surah 113: Al-Falaq
  113: [
    {
      numberInSurah: 1,
      numberInQuran: 6226,
      textAr: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      translationTr: 'De ki: Sabahın Rabbine sığınırım;',
      tafsirAr: 'قل: أعتصم وألتجئ برب الصبح وفالقه بنوره بعد الظلام.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113001.mp3',
    },
    {
      numberInSurah: 2,
      numberInQuran: 6227,
      textAr: 'مِن شَرِّ مَا خَلَقَ',
      translationTr: 'Yarattığı şeylerin şerrinden,',
      tafsirAr: 'من شر جميع المخلوقات وما يصدر منها من أذى ومكاره.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113002.mp3',
    },
    {
      numberInSurah: 3,
      numberInQuran: 6228,
      textAr: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      translationTr: 'Karanlığı çöktüğü zaman gecenin şerrinden,',
      tafsirAr: 'ومن شر الليل إذا دخل بظلامه، وما ينتشر فيه من الشياطين وأهل السوء.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113003.mp3',
    },
    {
      numberInSurah: 4,
      numberInQuran: 6229,
      textAr: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      translationTr: 'Düğümlere üfleyen (büyücülerin) şerrinden,',
      tafsirAr: 'ومن شر السواحر اللاتي يعقدن الخيوط وينفثن فيها بالسحر والأذى.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113004.mp3',
    },
    {
      numberInSurah: 5,
      numberInQuran: 6230,
      textAr: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      translationTr: 'Ve haset ettiği vakit hasetçinin şerrinden.',
      tafsirAr: 'ومن شر من يتمنى زوال النعمة عن غيره ويسعى في إيذائه بعينه أو كيده.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113005.mp3',
    },
  ],

  // Surah 114: An-Nas
  114: [
    {
      numberInSurah: 1,
      numberInQuran: 6231,
      textAr: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      translationTr: 'De ki: İnsanların Rabbine sığınırım,',
      tafsirAr: 'قل: ألتجئ وأحتمي برب البشر وخالقهم ومدبر أمورهم.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/114001.mp3',
    },
    {
      numberInSurah: 2,
      numberInQuran: 6232,
      textAr: 'مَلِكِ النَّاسِ',
      translationTr: 'İnsanların yegâne Hükümdârına,',
      tafsirAr: 'المتصرف فيهم بما يشاء، لا ملك حقيقي سواه.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/114002.mp3',
    },
    {
      numberInSurah: 3,
      numberInQuran: 6233,
      textAr: 'إِلَٰهِ النَّاسِ',
      translationTr: 'İnsanların gerçek İlâhına,',
      tafsirAr: 'معبودهم الحق الذي لا معبود بحق إلا هو سبحانه.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/114003.mp3',
    },
    {
      numberInSurah: 4,
      numberInQuran: 6234,
      textAr: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      translationTr: 'Sinsi vesvesecinin (şeytanın) şerrinden,',
      tafsirAr: 'من شر الشيطان الذي يوسوس في القلوب عند الغفلة، ويخنس ويتوارى عند ذكر الله تعالى.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/114004.mp3',
    },
    {
      numberInSurah: 5,
      numberInQuran: 6235,
      textAr: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      translationTr: 'O ki insanların göğüslerine vesvese verir,',
      tafsirAr: 'الذي يبث الشر والشك والشبهات في قلوب البشر.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/114005.mp3',
    },
    {
      numberInSurah: 6,
      numberInQuran: 6236,
      textAr: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
      translationTr: 'Gerek cinlerden gerek insanlardan olan (tüm vesvesecilerden).',
      tafsirAr: 'سواء كان الموسوس من شياطين الجن أم من شياطين الإنس الذين يدعون إلى الضلالة.',
      juz: 30,
      page: 604,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/114006.mp3',
    },
  ],

  // Surah 67: Al-Mulk
  67: [
    {
      numberInSurah: 1,
      numberInQuran: 5242,
      textAr: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      translationTr: 'Hükümranlık elinde olan Allah yüceler yücesidir; O her şeye hakkıyla kadirdir.',
      tafsirAr: 'تعاظم وكثر خير الله الذي بيده وحده ملك السماوات والأرض والدنيا والآخرة، وهو على كل شيء قدير.',
      juz: 29,
      page: 562,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/067001.mp3',
    },
    {
      numberInSurah: 2,
      numberInQuran: 5243,
      textAr: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
      translationTr: 'O, hanginizin daha güzel amel işleyeceğini sınamak için ölümü ve hayatı yaratandır. O, mutlak güç sahibidir, çok bağışlayandır.',
      tafsirAr: 'خلق الحياة والعدم ليختبركم: أيكم أخلص لله عملاً وأصوبه، وهو القوي الغالب لمن عصاه، الغفور لمن تاب إليه.',
      juz: 29,
      page: 562,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/067002.mp3',
    },
    {
      numberInSurah: 3,
      numberInQuran: 5244,
      textAr: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
      translationTr: 'O, yedi göğü tabaka tabaka yaratandır. Rahmân\'ın yaratışında hiçbir uyumsuzluk göremezsin. Bir kere daha bak, hiçbir çatlak görebilir misin?',
      tafsirAr: 'الذي خلق سبع سماوات بعضها فوق بعض في غاية الإحكام والتناسق، فكرر النظر في خلق السماء هل ترى فيها شقاً أو عيباً؟',
      juz: 29,
      page: 562,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/067003.mp3',
    },
  ],

  // Surah 108: Al-Kawthar
  108: [
    {
      numberInSurah: 1,
      numberInQuran: 6205,
      textAr: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      translationTr: 'Şüphesiz biz sana Kevser\'i verdik.',
      tafsirAr: 'إنا أعطيناك يا محمد الخير الكثير الدائم في الدنيا والآخرة، ومنه نهر الكوثر العظيم في الجنة.',
      juz: 30,
      page: 602,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/108001.mp3',
    },
    {
      numberInSurah: 2,
      numberInQuran: 6206,
      textAr: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      translationTr: 'O halde Rabbin için namaz kıl ve kurban kes.',
      tafsirAr: 'فأخلص لربك صلاتك كلها، واذبح أضاحيك وقرابينك له وحده شكراً على نعمه.',
      juz: 30,
      page: 602,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/108002.mp3',
    },
    {
      numberInSurah: 3,
      numberInQuran: 6207,
      textAr: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
      translationTr: 'Asıl sonu kesik (ebter) olan, sana buğzeden (düşmanın)dır.',
      tafsirAr: 'إن مبغضك وعدوك هو المنقطع عن كل خير، المنقطع ذكره وعقبه.',
      juz: 30,
      page: 602,
      audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/108003.mp3',
    },
  ],
};

/**
 * Fetches Surah verses dynamically from Al-Quran Cloud API with Turkish Diyanet translation
 * and Mishary audio recitations, with instant fallback to predefined data.
 */
export async function fetchSurahVerses(surahNumber: number): Promise<QuranAyah[]> {
  // If we already have rich offline data for this surah, return it immediately or as fast cache
  if (PREDEFINED_SURAHS_VERSES[surahNumber]) {
    return PREDEFINED_SURAHS_VERSES[surahNumber];
  }

  try {
    // Fetch Arabic text and Turkish translation in parallel
    const [arRes, trRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/tr.diyanet`),
    ]);

    if (!arRes.ok || !trRes.ok) {
      throw new Error('Network response not ok');
    }

    const arData = await arRes.json();
    const trData = await trRes.json();

    const arAyahs = arData.data.ayahs || [];
    const trAyahs = trData.data.ayahs || [];

    const padSurah = surahNumber.toString().padStart(3, '0');

    const ayahs: QuranAyah[] = arAyahs.map((item: any, index: number) => {
      const padAyah = item.numberInSurah.toString().padStart(3, '0');
      return {
        numberInSurah: item.numberInSurah,
        numberInQuran: item.number,
        textAr: item.text,
        translationTr: trAyahs[index]?.text || '...',
        tafsirAr: `الآية رقم ${item.numberInSurah} من سورة ${arData.data.name}`,
        juz: item.juz,
        page: item.page,
        audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${padSurah}${padAyah}.mp3`,
      };
    });

    return ayahs;
  } catch (err) {
    console.warn(`Failed to fetch surah ${surahNumber} online, generating structured offline verses:`, err);
    // Return structured placeholder verses so app never breaks
    const meta = SURAHS_CATALOG.find(s => s.number === surahNumber);
    const count = Math.min(meta ? meta.versesCount : 10, 10);
    const padSurah = surahNumber.toString().padStart(3, '0');
    
    const fallback: QuranAyah[] = [];
    for (let i = 1; i <= count; i++) {
      const padAyah = i.toString().padStart(3, '0');
      fallback.push({
        numberInSurah: i,
        numberInQuran: i,
        textAr: i === 1 ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : `آية كريمة من سورة ${meta?.nameAr || ''} (${i})`,
        translationTr: `${meta?.nameTr || ''} suresi ${i}. ayet`,
        tafsirAr: `تفسير الآية ${i} من سورة ${meta?.nameAr}`,
        juz: meta?.juzStart || 1,
        page: 1,
        audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${padSurah}${padAyah}.mp3`,
      });
    }
    return fallback;
  }
}
