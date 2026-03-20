const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const https = require('https');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/movie-recommender';

const fetchGlobalMovies = () => {
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
};

const mapGenresToTags = (genres) => {
  const tags = [];
  const gStr = genres.join(' ').toLowerCase();
  
  if (gStr.includes('action') || gStr.includes('adventure')) tags.push('action', 'intense');
  if (gStr.includes('sci-fi') || gStr.includes('fantasy')) tags.push('sci-fi', 'mind-bending');
  if (gStr.includes('comedy')) tags.push('funny', 'feel-good', 'comedy');
  if (gStr.includes('drama') || gStr.includes('romance')) tags.push('emotional', 'romance');
  if (gStr.includes('thriller') || gStr.includes('horror') || gStr.includes('crime')) tags.push('dark', 'thriller', 'intense');
  if (gStr.includes('family') || gStr.includes('animation')) tags.push('feel-good', 'funny');
  
  if (tags.length === 0) tags.push('mind-bending', 'emotional');
  return [...new Set(tags)];
};

const fetchIMDbPoster = (searchStr) => {
  return new Promise((resolve) => {
    const cleanStr = searchStr.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanStr) return resolve(null);
    const firstLetter = cleanStr[0];
    
    https.get(`https://v3.sg.media-imdb.com/suggestion/${firstLetter}/${cleanStr}.json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.d && json.d[0] && json.d[0].i) {
            resolve(json.d[0].i.imageUrl);
          } else {
            resolve(null);
          }
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

// Extremely extensive and accurate movie list
const diverseIndianMovies = [
  // --- KANNADA (10) ---
  { title: "KGF: Chapter 1", language: "Kannada", platforms: ["Amazon Prime"], tags: ["action", "intense", "thriller", "dark"], desc: "In the 1970s, a gangster goes undercover as a slave to assassinate the owner of a notorious gold mine." },
  { title: "KGF: Chapter 2", language: "Kannada", platforms: ["Amazon Prime"], tags: ["action", "thriller", "intense", "dark"], desc: "The blood-soaked land of Kolar Gold Fields has a new overlord now, Rocky." },
  { title: "Kantara", language: "Kannada", platforms: ["Amazon Prime", "Netflix"], tags: ["action", "thriller", "mind-bending", "dark", "intense"], desc: "A fiery young man clashes with an unflinching forest officer in a south Indian village where spirituality, fate and folklore rule." },
  { title: "777 Charlie", language: "Kannada", platforms: ["Amazon Prime", "Voot"], tags: ["emotional", "feel-good", "comedy", "funny"], desc: "A journey of an abuse-survivor dog and his cranky companion towards redemption." },
  { title: "Ugramm", language: "Kannada", platforms: ["Zee5"], tags: ["action", "thriller", "dark", "intense"], desc: "A man with a dangerous past must protect a girl from those who are hell bent on killing her." },
  { title: "Mufti", language: "Kannada", platforms: ["Zee5"], tags: ["action", "crime", "thriller", "dark"], desc: "An undercover cop ventures into a territory completely governed by a don, to track and eliminate him." },
  { title: "Kirik Party", language: "Kannada", platforms: ["Voot", "JioCinema"], tags: ["comedy", "feel-good", "romance", "funny"], desc: "A gang of mischievous students experience heartbreak and reality as they progress through engineering college." },
  { title: "Mungaru Male", language: "Kannada", platforms: ["Disney+ Hotstar"], tags: ["romance", "emotional", "feel-good"], desc: "A young man falls deeply in love with a girl who's engaged to someone else." },
  { title: "Lucia", language: "Kannada", platforms: ["Sun NXT"], tags: ["mind-bending", "sci-fi", "thriller", "romance"], desc: "An usher at a cinema gets a pill that blurs the line between his dreams and reality." },
  { title: "RangiTaranga", language: "Kannada", platforms: ["Sun NXT"], tags: ["mystery", "thriller", "dark", "mind-bending"], desc: "A novelist and his wife experience strange supernatural events in her ancestral village." },

  // --- TELUGU (10) ---
  { title: "Baahubali: The Beginning", language: "Telugu", platforms: ["Disney+ Hotstar", "Netflix"], tags: ["action", "intense", "emotional", "romance"], desc: "An adventurous man becomes involved in a decades-old feud between two warring people." },
  { title: "Baahubali 2: The Conclusion", language: "Telugu", platforms: ["Disney+ Hotstar", "Netflix"], tags: ["action", "emotional", "mind-bending"], desc: "Amarendra Baahubali finds his relationships endangered as his adoptive brother conspires against him." },
  { title: "RRR", language: "Telugu", platforms: ["Netflix", "Zee5"], tags: ["action", "intense", "emotional", "thriller"], desc: "A fictitious story about two legendary revolutionaries fighting for their country in the 1920s." },
  { title: "Pushpa: The Rise", language: "Telugu", platforms: ["Amazon Prime"], tags: ["action", "intense", "thriller", "dark"], desc: "A laborer rises through the ranks of a red sandal smuggling syndicate." },
  { title: "Arjun Reddy", language: "Telugu", platforms: ["Amazon Prime"], tags: ["romance", "emotional", "dark", "intense"], desc: "A short-tempered surgeon gets used to drugs when his girlfriend marries another person." },
  { title: "Eega", language: "Telugu", platforms: ["Disney+ Hotstar"], tags: ["funny", "sci-fi", "action", "feel-good", "thriller"], desc: "A murdered man is reincarnated as a housefly and seeks to avenge his death." },
  { title: "Sita Ramam", language: "Telugu", platforms: ["Amazon Prime", "Disney+ Hotstar"], tags: ["romance", "emotional", "feel-good"], desc: "An orphan soldier gets a letter from a presumed dead woman and goes on a quest to find her." },
  { title: "Jersey", language: "Telugu", platforms: ["Zee5", "Disney+ Hotstar"], tags: ["emotional", "feel-good", "action"], desc: "A failed cricketer decides to revive his career in his late 30s despite his health." },
  { title: "Magadheera", language: "Telugu", platforms: ["Amazon Prime"], tags: ["action", "romance", "mind-bending", "sci-fi"], desc: "A warrior is reincarnated 400 years later to rescue a princess from an evil conqueror." },
  { title: "Kalki 2898 AD", language: "Telugu", platforms: ["Netflix", "Amazon Prime"], tags: ["sci-fi", "action", "mind-bending", "intense"], desc: "A futuristic mytho-sci-fi epic intertwining ancient legends." },

  // --- TAMIL (10) ---
  { title: "Vikram", language: "Tamil", platforms: ["Disney+ Hotstar", "Zee5"], tags: ["action", "thriller", "dark", "intense"], desc: "A special investigator discovers a case of serial killings is not what it seems." },
  { title: "Vikram Vedha", language: "Tamil", platforms: ["Disney+ Hotstar", "Zee5"], tags: ["action", "mind-bending", "dark", "thriller"], desc: "A pragmatic police officer and a legendary criminal clash in an epic showdown." },
  { title: "Kaithi", language: "Tamil", platforms: ["Disney+ Hotstar"], tags: ["action", "thriller", "intense", "dark"], desc: "An ex-convict striving to meet his daughter must transport poisoned cops." },
  { title: "Asuran", language: "Tamil", platforms: ["Amazon Prime"], tags: ["action", "intense", "dark", "emotional"], desc: "The teenage son of a farmer kills a rich, upper caste landlord, forcing his family to run." },
  { title: "Enthiran", language: "Tamil", platforms: ["Sun NXT"], tags: ["sci-fi", "action", "romance"], desc: "A brilliant scientist builds a humanoid robot that develops destructive human emotions." },
  { title: "Master", language: "Tamil", platforms: ["Amazon Prime"], tags: ["action", "intense", "dark"], desc: "An alcoholic professor is sent to a juvenile school, where he clashes with a gangster." },
  { title: "Ratsasan", language: "Tamil", platforms: ["Disney+ Hotstar"], tags: ["thriller", "dark", "mind-bending", "intense"], desc: "A sub-inspector sets out in pursuit of a mysterious serial killer who targets teen school girls." },
  { title: "96", language: "Tamil", platforms: ["Sun NXT"], tags: ["romance", "emotional", "feel-good"], desc: "Two high school sweethearts meet at a reunion after 22 years and reminisce about their past." },
  { title: "Super Deluxe", language: "Tamil", platforms: ["Netflix"], tags: ["mind-bending", "dark", "comedy", "funny"], desc: "An unfaithful wife, an angry boy, and a transgender woman face their demons on one strange day." },
  { title: "Maharaja", language: "Tamil", platforms: ["Netflix"], tags: ["thriller", "dark", "mind-bending", "action"], desc: "A barber goes to extreme lengths to find his missing dustbin..." },

  // --- MALAYALAM (10) ---
  { title: "Drishyam", language: "Malayalam", platforms: ["Disney+ Hotstar"], tags: ["thriller", "mind-bending", "dark", "intense"], desc: "A man goes to extreme lengths to save his family from punishment after an accidental crime." },
  { title: "Premam", language: "Malayalam", platforms: ["Disney+ Hotstar", "Zee5"], tags: ["romance", "comedy", "feel-good", "funny"], desc: "George, a young student, falls for powerful loves across his life journey." },
  { title: "Kumbalangi Nights", language: "Malayalam", platforms: ["Amazon Prime"], tags: ["feel-good", "emotional", "funny"], desc: "Four brothers who share a love-hate relationship ultimately stand together during a crisis." },
  { title: "Minnal Murali", language: "Malayalam", platforms: ["Netflix"], tags: ["action", "sci-fi", "comedy", "funny"], desc: "A tailor gains special powers after being struck by lightning." },
  { title: "Lucifer", language: "Malayalam", platforms: ["Amazon Prime"], tags: ["action", "thriller", "intense", "dark"], desc: "A political godfather dies and a power struggle ensues, causing chaos in his wake." },
  { title: "Bangalore Days", language: "Malayalam", platforms: ["Disney+ Hotstar"], tags: ["feel-good", "comedy", "romance", "funny"], desc: "Three cousins move to Bangalore to discover what lies ahead for their dreams and relationships." },
  { title: "Trance", language: "Malayalam", platforms: ["Amazon Prime"], tags: ["mind-bending", "dark", "thriller"], desc: "A motivational speaker is hired by a corporate body to act as a miracle worker." },
  { title: "Joji", language: "Malayalam", platforms: ["Amazon Prime"], tags: ["dark", "thriller", "mind-bending"], desc: "An engineering dropout commits a horrific crime driven by greed." },
  { title: "Manjummel Boys", language: "Malayalam", platforms: ["Disney+ Hotstar"], tags: ["thriller", "emotional", "feel-good", "intense"], desc: "A group of friends travel to Kodaikanal and face an unexpected survival crisis." },
  { title: "Premalu", language: "Malayalam", platforms: ["Disney+ Hotstar"], tags: ["comedy", "romance", "funny", "feel-good"], desc: "A romantic comedy revolving around a man's pursuit of love in Hyderabad." },

  // --- HINDI / BOLLYWOOD (10) ---
  { title: "3 Idiots", language: "Hindi", platforms: ["Amazon Prime"], tags: ["comedy", "feel-good", "emotional", "funny"], desc: "Two friends are searching for their long lost companion." },
  { title: "Dangal", language: "Hindi", platforms: ["Apple TV"], tags: ["action", "emotional", "intense", "feel-good"], desc: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games." },
  { title: "Gangs of Wasseypur", language: "Hindi", platforms: ["Netflix", "Amazon Prime"], tags: ["action", "dark", "thriller", "intense"], desc: "A clash between Sultan and Shahid Khan leads to the expulsion of Khan from Wasseypur, and ignites a deadly blood feud." },
  { title: "PK", language: "Hindi", platforms: ["Netflix", "Sony LIV"], tags: ["comedy", "sci-fi", "funny", "feel-good"], desc: "An alien on Earth loses the only device he can use to communicate with his spaceship." },
  { title: "Andhadhun", language: "Hindi", platforms: ["Netflix", "JioCinema"], tags: ["thriller", "dark", "mind-bending", "comedy"], desc: "A series of mysterious events change the life of a blind pianist." },
  { title: "Zindagi Na Milegi Dobara", language: "Hindi", platforms: ["Netflix", "Amazon Prime"], tags: ["feel-good", "romance", "comedy", "funny"], desc: "Three friends decide to turn their fantasy vacation into reality." },
  { title: "Barfi!", language: "Hindi", platforms: ["Netflix"], tags: ["romance", "emotional", "feel-good", "funny"], desc: "Three young people learn that love can neither be defined nor contained by society's norms of normal and abnormal." },
  { title: "Tumbbad", language: "Hindi", platforms: ["Amazon Prime"], tags: ["dark", "thriller", "mind-bending", "intense"], desc: "A mythological story about a goddess who created the entire universe." },
  { title: "Queen", language: "Hindi", platforms: ["Netflix", "Voot"], tags: ["comedy", "feel-good", "funny", "emotional"], desc: "A Delhi girl from a traditional family sets out on a solo honeymoon after her marriage gets cancelled." },
  { title: "Chhichhore", language: "Hindi", platforms: ["Disney+ Hotstar"], tags: ["comedy", "emotional", "feel-good", "funny"], desc: "A tragic incident forces Anirudh, a middle-aged man, to take a trip down memory lane." }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Multi-Language Seeding');
    
    // Hollywood Base
    const dbData = await fetchGlobalMovies();
    const globalPlatforms = ["Netflix", "Amazon Prime", "Max", "Disney+ Hotstar", "Hulu", "Apple TV"];
    
    const hollywoodMovies = dbData.movies
      .filter(m => m.posterUrl && m.posterUrl.includes('http'))
      .slice(0, 100)
      .map(m => {
        // randomly assign 1-2 OTT platforms
        const numPlatforms = Math.floor(Math.random() * 2) + 1;
        const shuffled = [...globalPlatforms].sort(() => 0.5 - Math.random());
        const moviePlatforms = shuffled.slice(0, numPlatforms);
        
        return {
          title: m.title,
          genre: m.genres,
          moodTags: mapGenresToTags(m.genres),
          rating: Math.floor(Math.random() * (9 - 7) + 7) + 0.5,
          description: m.plot || `An amazing ${m.genres.join('/')} hollywood blockbuster.`,
          posterUrl: m.posterUrl,
          releaseYear: parseInt(m.year) || 2000,
          language: "English",
          ottPlatforms: moviePlatforms
        };
      });

    const authenticIndianMovies = [];
    console.log(`Fetching IMDB posters for exactly ${diverseIndianMovies.length} Regional Indian Movies...`);
    
    for (const movie of diverseIndianMovies) {
      const poster = await fetchIMDbPoster(movie.title);
    authenticIndianMovies.push({
    title: movie.title,
   genre: ["Drama", "Action", "Indian Cinema"],
  moodTags: movie.tags, // ✅ FIXED
  rating: Math.floor(Math.random() * (9 - 7) + 7) + 0.5,
  description: `(${movie.language}) ${movie.desc}`,
  posterUrl: poster || `https://picsum.photos/seed/${encodeURIComponent(movie.title)}/600/900`, 
  releaseYear: 2020 + Math.floor(Math.random() * 4),
  language: movie.language,
  ottPlatforms: movie.platforms
});
    }

    const allMovies = [...hollywoodMovies, ...authenticIndianMovies];

    await Movie.deleteMany(); 
    console.log('Cleared existing movies');
    
    await Movie.insertMany(allMovies);
    console.log(`✅ Successfully seeded database with diverse multilingual movies and OTT platforms!`);
    
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedDatabase();
