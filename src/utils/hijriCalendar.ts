import { IslamicEvent } from '../types';

export const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

export const HIJRI_MONTHS_TR = [
  'Muharrem',
  'Sefer',
  'Rebiülevvel',
  'Rebiülâhir',
  'Cemâziyelevvel',
  'Cemâziyelâhir',
  'Recep',
  'Şaban',
  'Ramazan',
  'Şevval',
  'Zilkade',
  'Zilhicce',
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    titleAr: 'رأس السنة الهجرية الجديدة',
    titleTr: 'Hicri Yılbaşı (1 Muharrem)',
    hijriDay: 1,
    hijriMonth: 1,
    descriptionAr: 'بداية العام الهجري الجديد وذكرى هجرة النبي صلى الله عليه وسلم.',
    descriptionTr: 'Yeni Hicri yılın başlangıcı ve Kutlu Hicret\'in hatırası.',
  },
  {
    titleAr: 'يوم عاشوراء',
    titleTr: 'Aşûre Günü (10 Muharrem)',
    hijriDay: 10,
    hijriMonth: 1,
    descriptionAr: 'اليوم العاشر من محرم، صومه يكفر سنة ماضية، وفيه نجا الله موسى وقومه.',
    descriptionTr: 'Muharrem ayının 10. günü; oruç tutulması sünnet olan mübarek gün.',
  },
  {
    titleAr: 'المولد النبوي الشريف',
    titleTr: 'Mevlid Kandili (12 Rebiülevvel)',
    hijriDay: 12,
    hijriMonth: 3,
    descriptionAr: 'ذكرى مولد سيد الخلق وخاتم الأنبياء محمد صلى الله عليه وسلم.',
    descriptionTr: 'Peygamber Efendimiz Hazreti Muhammed\'in (s.a.v) dünyayı teşrifi.',
  },
  {
    titleAr: 'ليلة الرغائب',
    titleTr: 'Regaip Kandili (Recep ayının ilk Cuma gecesi)',
    hijriDay: 4,
    hijriMonth: 7,
    descriptionAr: 'من الليالي المباركة في مستهل الأشهر الحرم وشهر رجب.',
    descriptionTr: 'Üç ayların başlangıcı ve Recep ayının ilk Cuma gecesi.',
  },
  {
    titleAr: 'ذكرى الإسراء والمعراج',
    titleTr: 'Mirâç Kandili (27 Recep)',
    hijriDay: 27,
    hijriMonth: 7,
    descriptionAr: 'معجزة الإسراء من المسجد الحرام للأقصى والمعراج للسماوات العلى وفرض الصلوات الخمس.',
    descriptionTr: 'Peygamberimiz\'in semaya yükselişi ve 5 vakit namazın farz kılındığı gece.',
  },
  {
    titleAr: 'ليلة النصف من شعبان (البراءة)',
    titleTr: 'Beraat Kandili (15 Şaban)',
    hijriDay: 15,
    hijriMonth: 8,
    descriptionAr: 'ليلة مباركة تغفر فيها الذنوب وترفع فيها الأعمال إلى الله تعالى.',
    descriptionTr: 'Günahlardan arınma, af ve ilahi rahmete kavuşma gecesi.',
  },
  {
    titleAr: 'بداية شهر رمضان المبارك',
    titleTr: 'Ramazan-ı Şerif Başlangıcı (1 Ramazan)',
    hijriDay: 1,
    hijriMonth: 9,
    descriptionAr: 'أول أيام شهر الصيام والقرآن والرحمة والمغفرة والعتق من النيران.',
    descriptionTr: 'On bir ayın sultanı, oruç, Kur\'an ve mağfiret ayının ilk günü.',
  },
  {
    titleAr: 'ليلة القدر المباركة',
    titleTr: 'Kadir Gecesi (27 Ramazan)',
    hijriDay: 27,
    hijriMonth: 9,
    descriptionAr: 'خير من ألف شهر، نزل فيها القرآن الكريم وتتنزل فيها الملائكة والروح.',
    descriptionTr: 'Bin aydan daha hayırlı, Kur\'an-ı Kerim\'in indirildiği en kutlu gece.',
  },
  {
    titleAr: 'عيد الفطر المبارك',
    titleTr: 'Ramazan Bayramı (1 Şevval)',
    hijriDay: 1,
    hijriMonth: 10,
    descriptionAr: 'فرحة الصائمين بإتمام شهر الصيام وإكرام الله لعباده.',
    descriptionTr: 'Ramazan ayının tamamlanması vesilesiyle kutlanan mübarek bayram.',
  },
  {
    titleAr: 'يوم عرفة',
    titleTr: 'Arefe Günü (9 Zilhicce)',
    hijriDay: 9,
    hijriMonth: 12,
    descriptionAr: 'أعظم أيام العام، وقفة الحجاج بعرفة، وصيامه يكفر سنتين.',
    descriptionTr: 'Hacıların Arafat\'ta vakfeye durduğu, duaların kabul olduğu en faziletli gün.',
  },
  {
    titleAr: 'عيد الأضحى المبارك',
    titleTr: 'Kurban Bayramı (10 Zilhicce)',
    hijriDay: 10,
    hijriMonth: 12,
    descriptionAr: 'عيد النحر، التقرب إلى الله بالأضاحي وإحياء ملة إبراهيم الخليل.',
    descriptionTr: 'İlahi rıza ve takva ile kurbanların kesildiği mübarek bayram.',
  },
];

/**
 * Converts Gregorian Date to accurate Hijri Date (Kuwaiti / Umm Al-Qura algorithm)
 */
export function getHijriDate(date: Date = new Date()): {
  day: number;
  month: number;
  year: number;
  monthNameAr: string;
  monthNameTr: string;
  formattedAr: string;
  formattedTr: string;
} {
  // Use Intl if supported by environment
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    let day = 1;
    let month = 1;
    let year = 1448;

    for (const part of parts) {
      if (part.type === 'day') day = parseInt(part.value, 10);
      if (part.type === 'month') month = parseInt(part.value, 10);
      if (part.type === 'year') year = parseInt(part.value, 10);
    }

    const mIdx = Math.max(0, Math.min(11, month - 1));
    const monthNameAr = HIJRI_MONTHS_AR[mIdx];
    const monthNameTr = HIJRI_MONTHS_TR[mIdx];

    return {
      day,
      month,
      year,
      monthNameAr,
      monthNameTr,
      formattedAr: `${day} ${monthNameAr} ${year} هـ`,
      formattedTr: `${day} ${monthNameTr} ${year}`,
    };
  } catch {
    // Algorithmic fallback
    const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
    const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    const month = Math.floor((24 * l3) / 709);
    const day = l3 - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;

    const mIdx = Math.max(0, Math.min(11, month - 1));
    return {
      day,
      month,
      year,
      monthNameAr: HIJRI_MONTHS_AR[mIdx],
      monthNameTr: HIJRI_MONTHS_TR[mIdx],
      formattedAr: `${day} ${HIJRI_MONTHS_AR[mIdx]} ${year} هـ`,
      formattedTr: `${day} ${HIJRI_MONTHS_TR[mIdx]} ${year}`,
    };
  }
}
