// Per-simulation explanations shown under the canvas on /sims/:id.
//
// Deliberately its own module rather than part of simCatalog.js: the catalogue
// is imported by all three pages, and the landing page and gallery would then
// carry several kilobytes of prose they never render. Only SimPage imports
// this, so Vite splits it away from the other routes.
//
// Written for gimnaziu — short paragraphs, no notation the reader hasn't been
// given, and each idea tied to something visible on the canvas. The pitch
// deliberately starts from right-triangle trigonometry (sin = cateta opusă /
// ipotenuză), which comes earlier in the Romanian curriculum, and shows the
// unit circle as the thing that makes it simpler rather than as new material.
//
// `blocks` are the explanation; `try` is a short list of things to do with the
// slider, since the whole premise of the site is that moving a control is what
// makes the idea land.
export const SIM_THEORY = {
  pulley: {
    ro: {
      blocks: [
        {
          heading: "Un singur scripete nu ajută cu nimic",
          body:
            "Pune n = 1 și privește: forța roșie F este mereu la fel de mare ca greutatea albastră G. Un singur scripete fix doar schimbă direcția frânghiei — tragi în jos ca să ridici o greutate — dar nu-ți micșorează efortul deloc. De aici pornește totul: adăugarea de scripeți este ce schimbă lucrurile.",
        },
        {
          heading: "Fiecare fir care susține greutatea te ajută",
          body:
            "Pe desen, greutatea atârnă de bara mobilă, iar bara este susținută de n fire paralele. Fiecare dintre aceste fire duce o parte egală din greutate. Cu n fire, fiecare duce doar G/n din efort — și tocmai firul pe care îl tragi tu cu mâna este unul dintre acestea. De asta F = G/n.",
        },
        {
          heading: "Prețul: mult mai multă frânghie",
          body:
            "Nimic nu e gratis. Dacă greutatea urcă un metru, fiecare dintre cele n fire trebuie să se scurteze cu un metru — iar tu trebuie să tragi toată frânghia aceea prin scripeți. Pentru n scripeți, tragi n metri de frânghie ca să ridici greutatea doar un metru. Urmărește cele două cifre de jos în timpul animației: „frânghie trasă” crește mereu de n ori mai repede decât „greutate ridicată”.",
        },
        {
          heading: "Aceeași idee ca la planul înclinat",
          body:
            "Ai mai văzut acest schimb la planul înclinat: acolo alunecai o distanță mai lungă pe rampă ca să câștigi o înălțime mai mică, dar mai ușor de urcat. Aici este identic — muncă egală, doar împărțită altfel între forță și distanță. Niciun scripete nu-ți dă ceva pe degeaba, doar reorganizează efortul.",
        },
        {
          heading: "De ce contează pentru unelte reale",
          body:
            "Un macarale de construcție ridică tone folosind mulți scripeți tocmai din acest motiv: nimeni nu poate trage direct greutatea unui stâlp de beton, dar poate trage o frânghie subțire mult mai lungă, cu o forță pe care o mână o poate gestiona. Cu cât ai nevoie să ridici ceva mai greu cu o forță mai mică, cu atât ai nevoie de mai mulți scripeți — și de mai multă frânghie.",
        },
        {
          heading: "Ce nu se schimbă",
          body:
            "Observă că schimbarea numărului de scripeți în timp ce greutatea urcă nu o oprește și nu o resetează — ea continuă de unde a rămas, doar cu o forță nouă calculată pentru noua valoare a lui n. Sistemul „își amintește” cât de sus a ajuns greutatea, indiferent ce schimbi la cursoare.",
        },
      ],
      try: [
        "Pune n = 1 și privește cele două săgeți: F și G au exact aceeași lungime — niciun câștig.",
        "Ridică n la 6, cu greutatea tot pe 120 N. Forța F scade la 20 N — de 6 ori mai mică — dar urmărește cifra „frânghie trasă” cum crește de 6 ori mai repede decât „greutate ridicată”.",
        "Lasă animația să ruleze cu n = 3 până greutatea ajunge sus. Verifică: greutate ridicată = 1,00 m, frânghie trasă = 3,00 m — exact de 3 ori mai mult.",
        "Schimbă greutatea (G) în timp ce animația rulează. Forța F se recalculează pe loc, dar înălțimea greutății nu sare înapoi la zero.",
      ],
    },

    en: {
      blocks: [
        {
          heading: "A single pulley buys you nothing",
          body:
            "Set n = 1 and watch: the red force F is always exactly as big as the blue weight G. A single fixed pulley only changes the rope's direction — you pull down to lift something up — but it does not reduce your effort at all. This is the baseline everything else improves on: adding pulleys is what changes things.",
        },
        {
          heading: "Every strand holding the load helps",
          body:
            "In the drawing, the load hangs from the movable bar, and that bar is held up by n parallel strands. Each of those strands carries an equal share of the weight. With n strands, each one only carries G/n of the load — and the strand you are pulling by hand is one of them. That is why F = G/n.",
        },
        {
          heading: "The price: far more rope",
          body:
            "Nothing is free. If the load rises one metre, each of the n strands has to shorten by one metre — and you have to haul all of that rope through the pulleys. For n pulleys, you pull n metres of rope to raise the load by just one metre. Watch the two numbers at the bottom during the animation: “rope pulled” always climbs n times faster than “load risen”.",
        },
        {
          heading: "The same idea as the inclined plane",
          body:
            "You have met this trade before, on the inclined plane: you slid a longer distance up the ramp in exchange for an easier climb to the same height. This is identical — the same amount of work, just split differently between force and distance. No pulley ever gives you something for nothing; it only reorganises the effort.",
        },
        {
          heading: "Why this matters for real machinery",
          body:
            "A construction crane lifts tonnes using many pulleys for exactly this reason: nobody can pull the weight of a concrete beam directly, but a motor can reel in a much longer, thinner cable at a force it can actually manage. The heavier the load you need to lift with a smaller force, the more pulleys — and the more rope — you need.",
        },
        {
          heading: "What stays put",
          body:
            "Notice that changing the pulley count while the load is rising does not stop or reset it — it keeps going from where it was, just with a newly calculated force for the new value of n. The system “remembers” how high the load has climbed no matter what you change on the sliders.",
        },
      ],
      try: [
        "Set n = 1 and look at the two arrows: F and G are exactly the same length — no gain at all.",
        "Raise n to 6, keeping the load at 120 N. Force F drops to 20 N — six times smaller — but watch the “rope pulled” number climb six times faster than “load risen”.",
        "Let the animation run at n = 3 until the load reaches the top. Check: load risen = 1.00 m, rope pulled = 3.00 m — exactly three times as much.",
        "Change the load (G) while the animation is running. Force F recalculates instantly, but the load's height doesn't jump back to zero.",
      ],
    },
  },

  "adjacent-angles": {
    ro: {
      blocks: [
        {
          heading: "Ce înseamnă unghiuri adiacente",
          body:
            "Toate unghiurile de aici pornesc din același punct O, numit vârf. Două unghiuri sunt adiacente dacă au vârful comun, se sprijină pe aceeași rază din mijloc și nu se suprapun. Pe desen, ∠AOB și ∠BOC împart raza OB: ea este latura comună.",
        },
        {
          heading: "Partea, partea și întregul",
          body:
            "Unghiul mare ∠AOC este format din cele două unghiuri mici puse cap la cap. De aceea măsurile lor se adună: ∠AOB + ∠BOC = ∠AOC. Este exact ca la lungimi — dacă mergi 3 metri și apoi încă 5, ai mers 8 în total.",
        },
        {
          heading: "Două moduri de lucru",
          body:
            "Butonul de mod schimbă întrebarea. În „Adună unghiurile” cunoști cele două părți și afli întregul. În „Află unghiul lipsă” cunoști întregul și una dintre părți, iar cealaltă se calculează prin scădere — este tipul de problemă pe care îl primești cel mai des la teze.",
        },
        {
          heading: "Cum afli unghiul lipsă",
          body:
            "Panoul din dreapta îți arată pașii scriși, exact cum i-ai scrie în caiet. Pornești de la relația ∠AOB + ∠BOC = ∠AOC, înlocuiești ce știi, apoi scazi din ambele părți valoarea cunoscută. Ce rămâne este unghiul căutat.",
        },
        {
          heading: "Complementare și suplementare",
          body:
            "Când cele două unghiuri adună exact 90°, ele se numesc complementare. Când adună 180°, se numesc suplementare, iar razele de la capete formează împreună o linie dreaptă. Caută aceste două cazuri trăgând de cursorul unghiului mare — aplicația ți le semnalează singură.",
        },
        {
          heading: "Razele trebuie să fie în ordine",
          body:
            "Fiecare rază trebuie să se deschidă mai mult decât cea dinaintea ei: OB înaintea lui OC, iar OC înaintea lui OD. Dacă le încurci, unghiurile nu mai sunt alăturate — una ar cădea în interiorul celeilalte în loc să stea lângă ea — și aplicația îți spune asta în loc să deseneze ceva fals.",
        },
      ],
      try: [
        "Lasă ∠AOB = 30° și ∠AOC = 142°, apoi apasă „Află unghiul lipsă”. Panoul din dreapta rezolvă pas cu pas și îți dă ∠BOC = 112°.",
        "Pune unghiul mare ∠AOC pe exact 90°. Cele două unghiuri mici devin complementare, oricum le-ai împărți între ele.",
        "Pune ∠AOC pe 180°. Razele OA și OC ajung în prelungire, formând o linie dreaptă: unghiurile sunt suplementare.",
        "Comută pe „3 unghiuri”. Regula nu se schimbă deloc, doar că acum ai trei părți de adunat: ∠AOB + ∠BOC + ∠COD = ∠AOD.",
      ],
    },

    en: {
      blocks: [
        {
          heading: "What adjacent angles are",
          body:
            "Every angle here starts from the same point O, called the vertex. Two angles are adjacent when they share that vertex, lean on the same middle ray, and do not overlap. In the drawing, ∠AOB and ∠BOC share the ray OB: that is their common side.",
        },
        {
          heading: "Part, part and whole",
          body:
            "The big angle ∠AOC is made of the two smaller ones placed end to end, so their measures add: ∠AOB + ∠BOC = ∠AOC. It works just like lengths — walk 3 metres and then 5 more, and you have walked 8 in total.",
        },
        {
          heading: "Two ways of working",
          body:
            "The mode button changes the question. In “Add the angles” you know both parts and find the whole. In “Find the missing angle” you know the whole and one part, and the other comes out by subtraction — which is the kind of question that turns up most often in tests.",
        },
        {
          heading: "How to find the missing angle",
          body:
            "The panel on the right shows the written steps, exactly as you would set them out in your exercise book. Start from ∠AOB + ∠BOC = ∠AOC, put in what you know, then subtract the known value from both sides. What is left is the angle you were after.",
        },
        {
          heading: "Complementary and supplementary",
          body:
            "When the two angles add to exactly 90° they are called complementary. When they add to 180° they are supplementary, and the outer rays together form a straight line. Hunt for both cases by dragging the big angle — the app points them out when you land on them.",
        },
        {
          heading: "The rays have to be in order",
          body:
            "Each ray must open further than the one before it: OB before OC, and OC before OD. Swap them around and the angles are no longer adjacent — one would sit inside the other instead of beside it — so the app says so rather than drawing something untrue.",
        },
      ],
      try: [
        "Leave ∠AOB = 30° and ∠AOC = 142°, then press “Find the missing angle”. The panel on the right works through it and gives ∠BOC = 112°.",
        "Set the big angle ∠AOC to exactly 90°. The two smaller angles are now complementary, however you split them between yourselves.",
        "Set ∠AOC to 180°. The rays OA and OC now point opposite ways, forming a straight line: the angles are supplementary.",
        "Switch to “3 angles”. The rule does not change at all, there are simply three parts to add: ∠AOB + ∠BOC + ∠COD = ∠AOD.",
      ],
    },
  },

  "triangle-angles": {
    ro: {
      blocks: [
        {
          heading: "Suma este mereu 180°",
          body:
            "Oricum ai desena un triunghi — mare, mic, turtit sau ascuțit — cele trei unghiuri ale lui adunate dau exact 180°. Nu este o coincidență și nu depinde de mărime: este o proprietate a oricărui triunghi din plan.",
        },
        {
          heading: "De ce e de ajuns să știi două unghiuri",
          body:
            "Dacă suma este mereu 180°, atunci al treilea unghi nu mai are de ales. Îl afli scăzând: C = 180° − A − B. De asta simularea îți cere doar două valori și îl calculează singură pe al treilea.",
        },
        {
          heading: "Rupe colțurile și pune-le alături",
          body:
            "Banda colorată de sub triunghi este experimentul clasic din clasă: decupezi cele trei colțuri ale unui triunghi de hârtie și le lipești unul lângă altul. Împreună formează exact o linie dreaptă, adică 180°. Mișcă cursoarele și vezi cum cele trei pene își schimbă mărimea, dar umplu mereu aceeași linie.",
        },
        {
          heading: "Ce fel de triunghi ai făcut",
          body:
            "Eticheta din dreapta sus se schimbă singură. „Acute” înseamnă ascuțitunghic — toate cele trei unghiuri sunt sub 90°. „Right” înseamnă dreptunghic — un unghi are fix 90°. „Obtuse” înseamnă obtuzunghic — un unghi trece de 90°. Un triunghi nu poate avea două unghiuri de 90° sau mai mari, fiindcă ar folosi deja tot bugetul de 180°.",
        },
        {
          heading: "Când nu există niciun triunghi",
          body:
            "Mărește cele două unghiuri până suma lor ajunge la 180°. Laturile nu se mai întâlnesc niciodată: la exact 180° devin paralele, iar peste 180° se depărtează una de alta. Nu este o eroare a aplicației — pur și simplu nu mai rămân grade pentru al treilea unghi, așa că triunghiul nu se poate închide.",
        },
        {
          heading: "Unghiurile dau forma, nu mărimea",
          body:
            "Observă că desenul se rescalează singur ca să încapă pe ecran. Asta arată ceva important: unghiurile hotărăsc forma triunghiului, nu cât este el de mare. Două triunghiuri cu aceleași unghiuri au exact aceeași formă, unul fiind doar o mărire a celuilalt — se numesc triunghiuri asemenea.",
        },
      ],
      try: [
        "Pune A = 60° și B = 60°. Al treilea iese tot 60°: triunghiul echilateral, cu toate laturile egale.",
        "Pune A = 90°. Orice valoare ai alege apoi pentru B, triunghiul rămâne dreptunghic — unghiul drept este deja fixat.",
        "Pune A = 100° și B = 40°. Eticheta devine „Obtuse”: un unghi a trecut de 90°, iar celelalte două trebuie să se împartă ce a rămas.",
        "Ridică A și B până suma trece de 180°. Urmărește banda de jos: cele două pene singure ies deja în afara liniei drepte.",
      ],
    },

    en: {
      blocks: [
        {
          heading: "The sum is always 180°",
          body:
            "However you draw a triangle — large, small, flat or sharp — its three angles add up to exactly 180°. This is not a coincidence and it does not depend on size: it is a property of every triangle in the plane.",
        },
        {
          heading: "Why knowing two angles is enough",
          body:
            "If the total is always 180°, the third angle has no choice left. You find it by subtracting: C = 180° − A − B. That is why the simulation asks you for only two values and works out the third itself.",
        },
        {
          heading: "Tear off the corners and line them up",
          body:
            "The coloured strip below the triangle is the classic classroom experiment: cut the three corners off a paper triangle and place them side by side. Together they form exactly a straight line, which is 180°. Move the sliders and watch the three wedges change size while always filling that same line.",
        },
        {
          heading: "What kind of triangle you made",
          body:
            "The label in the top right updates by itself. “Acute” means all three angles are under 90°. “Right” means one angle is exactly 90°. “Obtuse” means one angle is over 90°. A triangle can never have two angles of 90° or more, because those alone would use up the whole 180° budget.",
        },
        {
          heading: "When no triangle exists",
          body:
            "Raise the two angles until their sum reaches 180°. The sides then never meet: at exactly 180° they become parallel, and beyond it they spread apart. This is not the app breaking — there are simply no degrees left for a third angle, so the triangle cannot close.",
        },
        {
          heading: "Angles fix the shape, not the size",
          body:
            "Notice how the drawing rescales itself to fit the screen. That shows something important: the angles decide the triangle's shape, not how big it is. Two triangles with the same angles have exactly the same shape, one just being an enlargement of the other — they are called similar triangles.",
        },
      ],
      try: [
        "Set A = 60° and B = 60°. The third comes out as 60° too: the equilateral triangle, with all sides equal.",
        "Set A = 90°. Whatever you then choose for B, the triangle stays right-angled — that 90° is already locked in.",
        "Set A = 100° and B = 40°. The label turns to “Obtuse”: one angle has passed 90°, and the other two must share what is left.",
        "Push A and B until their sum passes 180°. Watch the strip below: those two wedges alone already spill outside the straight line.",
      ],
    },
  },

  vectors: {
    ro: {
      blocks: [
        {
          heading: "Ce este un vector",
          body:
            "Un număr obișnuit spune doar cât. Un vector spune cât și încotro. Săgeata albastră are și lungime, și direcție — amândouă contează. Perechea de numere de lângă ea, de exemplu (4, 3), înseamnă: mergi 4 unități la dreapta și 3 în sus. Dacă un număr este negativ, mergi invers: la stânga sau în jos.",
        },
        {
          heading: "Adunarea cap-la-coadă",
          body:
            "Ca să aduni doi vectori, îl desenezi pe al doilea pornind din vârful primului — exact ce face săgeata punctată de pe desen. Rezultatul, numit rezultantă, este săgeata verde care merge direct de la punctul de plecare până la punctul final. Ea este scurtătura pentru cele două deplasări făcute una după alta.",
        },
        {
          heading: "De ce se adună numerele separat",
          body:
            "Deplasările pe orizontală se adună între ele, iar cele pe verticală între ele. Așa că (4, 3) + (−2, 5) = (2, 8). Nu amesteci niciodată orizontala cu verticala: sunt două direcții independente, care nu se influențează una pe alta.",
        },
        {
          heading: "Ordinea nu contează",
          body:
            "Dacă schimbi între ele valorile celor doi vectori, ajungi exact în același punct. Este aceeași regulă ca la numere: 4 + 3 dă cât 3 + 4. Drumurile arată diferit, dar capătul este identic.",
        },
        {
          heading: "Cum afli lungimea",
          body:
            "Orice vector este ipotenuza unui triunghi dreptunghic ale cărui catete sunt cele două componente ale lui. Deci lungimea se află cu teorema lui Pitagora: √(x² + y²). Pentru vectorul (3, 4) lungimea iese exact 5.",
        },
        {
          heading: "Gândește-te la o hartă",
          body:
            "Doi vectori sunt ca două indicații dintr-o vânătoare de comori: „4 pași spre est, 3 spre nord”, apoi „2 pași spre vest, 5 spre nord”. Rezultanta este linia dreaptă de la locul de start direct la comoară — drumul pe care l-ai fi putut face dintr-o singură mișcare.",
        },
      ],
      try: [
        "Pune v₁ = (4, 0) și v₂ = (0, 3). Rezultanta este (4, 3), iar lungimea ei este exact 5 — clasicul triunghi 3-4-5.",
        "Schimbă valorile lui v₁ cu ale lui v₂. Săgețile pornesc altfel, dar vârful verde ajunge în același loc.",
        "Fă-l pe v₂ opusul lui v₁, de exemplu (4, 3) și (−4, −3). Rezultanta devine zero: te-ai întors de unde ai plecat.",
        "Pune ambii vectori pe aceeași direcție. Atunci lungimile pur și simplu se adună, fără niciun triunghi.",
      ],
    },

    en: {
      blocks: [
        {
          heading: "What a vector is",
          body:
            "An ordinary number only tells you how much. A vector tells you how much and which way. The blue arrow has both a length and a direction — both matter. The pair of numbers beside it, say (4, 3), means: go 4 units right and 3 units up. A negative number just means the other way: left, or down.",
        },
        {
          heading: "Adding tip-to-tail",
          body:
            "To add two vectors, you draw the second one starting from the tip of the first — exactly what the dashed arrow on the drawing does. The result, called the resultant, is the green arrow running straight from the starting point to the finishing point. It is the shortcut for making both moves one after the other.",
        },
        {
          heading: "Why the numbers add separately",
          body:
            "Horizontal moves add to horizontal moves, and vertical to vertical. So (4, 3) + (−2, 5) = (2, 8). You never mix the two: they are independent directions and neither affects the other.",
        },
        {
          heading: "The order doesn't matter",
          body:
            "Swap the values of the two vectors and you land on exactly the same point. It is the same rule as with numbers: 4 + 3 equals 3 + 4. The paths look different, but the endpoint is identical.",
        },
        {
          heading: "Finding the length",
          body:
            "Every vector is the hypotenuse of a right triangle whose two shorter sides are its components. So its length comes from Pythagoras: √(x² + y²). For the vector (3, 4) that works out to exactly 5.",
        },
        {
          heading: "Think of a map",
          body:
            "Two vectors are like two clues in a treasure hunt: “4 paces east, 3 north”, then “2 paces west, 5 north”. The resultant is the straight line from where you started directly to the treasure — the walk you could have taken in one go.",
        },
      ],
      try: [
        "Set v₁ = (4, 0) and v₂ = (0, 3). The resultant is (4, 3), and its length is exactly 5 — the classic 3-4-5 triangle.",
        "Swap the values of v₁ and v₂. The arrows set off differently, but the green tip lands in the same place.",
        "Make v₂ the opposite of v₁, say (4, 3) and (−4, −3). The resultant becomes zero: you are back where you started.",
        "Point both vectors the same way. Now the lengths simply add up, with no triangle at all.",
      ],
    },
  },

  "inclined-plane": {
    ro: {
      blocks: [
        {
          heading: "Greutatea trage mereu drept în jos",
          body:
            "Săgeata albastră este greutatea corpului, mg. Oricât ai înclina rampa, ea arată exact în jos — gravitația nu știe că există o pantă. Tot ce urmează vine din despărțirea acestei singure forțe în două bucăți.",
        },
        {
          heading: "Cele două bucăți ale greutății",
          body:
            "Săgețile gri punctate arată această despărțire. O parte apasă perpendicular pe rampă și are mărimea mg·cos θ, iar cealaltă trage corpul la vale, de-a lungul pantei, și are mărimea mg·sin θ. Cu cât rampa este mai înclinată, cu atât partea care trage la vale devine mai mare, iar cea care apasă mai mică.",
        },
        {
          heading: "Rampa împinge înapoi",
          body:
            "Săgeata verde este forța normală N: rampa apasă înapoi, perpendicular pe suprafața ei. Ea echilibrează exact partea care apasă în rampă, deci N = mg·cos θ. Tocmai de aceea corpul rămâne pe suprafață în loc să intre prin ea.",
        },
        {
          heading: "Frecarea se opune alunecării",
          body:
            "Săgeata roșie este frecarea. Ea poate ține corpul pe loc, dar numai până la o limită: cel mult μ·N. Coeficientul μ spune cât de mult „se agață” cele două suprafețe una de alta — lemn pe lemn este în jur de 0,3, cauciuc pe asfalt uscat aproape 0,8, iar gheața aproape 0. De asta o carte stă liniștită pe o masă puțin înclinată, dar pleacă la vale dacă înclini masa mai mult.",
        },
        {
          heading: "Când începe să alunece",
          body:
            "Corpul pornește atunci când partea care trage la vale întrece frecarea maximă, adică mg·sin θ > μ·mg·cos θ. Împarte ambele părți la mg·cos θ și rămâne doar tan θ > μ. Exact cele două numere pe care afișajul de pe desen ți le pune alături.",
        },
        {
          heading: "De ce masa nu contează",
          body:
            "Uită-te ce s-a întâmplat mai sus: mg s-a simplificat și a dispărut din inegalitate. Masa apare de ambele părți — mărește și forța care trage la vale, și frecarea care se opune — așa că se anulează. Trage de cursorul masei și vezi singur: săgețile se lungesc, dar verdictul rămâne neschimbat.",
        },
      ],
      try: [
        "Pune μ = 0,50 și ridică încet unghiul. Corpul pornește chiar după 27°, pentru că tan 27° ≈ 0,51 tocmai a depășit 0,50.",
        "Oprește-l la orice unghi și trage de cursorul masei. Săgețile își schimbă lungimea, dar verdictul „Sliding” sau „Static” rămâne același.",
        "Pune μ = 0. Acum orice înclinare, oricât de mică, pune corpul în mișcare — nu mai există nimic care să-l țină.",
        "Pune μ = 0,80. Trebuie să ajungi pe la 39° ca să alunece, fiindcă tan 39° ≈ 0,81.",
      ],
    },

    en: {
      blocks: [
        {
          heading: "Weight always pulls straight down",
          body:
            "The blue arrow is the block's weight, mg. However far you tilt the ramp, it still points straight down — gravity does not know there is a slope there. Everything that follows comes from splitting this one force into two pieces.",
        },
        {
          heading: "The two pieces of the weight",
          body:
            "The dashed grey arrows show that split. One piece presses square into the ramp and measures mg·cos θ, the other drags the block down along the slope and measures mg·sin θ. The steeper the ramp, the bigger the down-slope piece becomes and the smaller the pressing one.",
        },
        {
          heading: "The ramp pushes back",
          body:
            "The green arrow is the normal force N: the ramp pushing back, at right angles to its surface. It exactly balances the piece pressing into the ramp, so N = mg·cos θ. That is why the block stays on the surface instead of sinking through it.",
        },
        {
          heading: "Friction resists sliding",
          body:
            "The red arrow is friction. It can hold the block still, but only up to a limit: at most μ·N. The coefficient μ says how much the two surfaces grip each other — wood on wood is around 0.3, rubber on dry tarmac close to 0.8, and ice nearly 0. It is why a book sits happily on a slightly tilted table but takes off once you tilt it further.",
        },
        {
          heading: "When it starts to slide",
          body:
            "The block goes when the down-slope pull beats the largest friction available: mg·sin θ > μ·mg·cos θ. Divide both sides by mg·cos θ and all that is left is tan θ > μ. Those are exactly the two numbers the readout on the drawing sets side by side.",
        },
        {
          heading: "Why mass makes no difference",
          body:
            "Look at what just happened: mg cancelled and dropped out of the inequality. Mass sits on both sides — it increases the pull down the slope and the friction resisting it by the same factor — so it cancels. Drag the mass slider and watch: the arrows get longer, but the verdict never changes.",
        },
      ],
      try: [
        "Set μ = 0.50 and raise the angle slowly. The block goes just past 27°, because tan 27° ≈ 0.51 has only just overtaken 0.50.",
        "Stop it at any angle and drag the mass slider. The arrows change length, but the “Sliding” or “Static” verdict stays put.",
        "Set μ = 0. Now any tilt at all, however slight, sets the block moving — there is nothing left to hold it.",
        "Set μ = 0.80. You have to reach about 39° before it slides, since tan 39° ≈ 0.81.",
      ],
    },
  },

  projectile: {
    ro: {
      blocks: [
        {
          heading: "Două mișcări în același timp",
          body:
            "Aruncă o minge și privește-o cu atenție: ea înaintează în față și, în același timp, urcă și apoi coboară. Sunt două mișcări suprapuse, una pe orizontală și una pe verticală. Săgețile gri punctate de lângă bilă arată exact aceste două părți ale vitezei, iar ele nu se influențează una pe alta.",
        },
        {
          heading: "Pe orizontală, viteza nu se schimbă",
          body:
            "Nimic nu împinge și nimic nu frânează bila pe orizontală, pentru că acest model lasă deoparte rezistența aerului. De aceea afișajul scrie „vx constant”: bila înaintează lateral cu aceeași viteză de la lansare până la aterizare.",
        },
        {
          heading: "Pe verticală, gravitația schimbă totul",
          body:
            "Viteza verticală scade fără oprire, cu 9,8 m/s în fiecare secundă. La început bila urcă, viteza verticală ajunge exact la zero în vârf — punctul roșu de pe desen — apoi devine negativă, iar bila coboară din ce în ce mai repede.",
        },
        {
          heading: "De ce iese o parabolă",
          body:
            "Pune la un loc o mișcare uniformă pe orizontală cu una accelerată pe verticală și obții exact curba desenată: o parabolă. Partea ștearsă îți arată tot drumul pe care îl va face bila, iar partea colorată cât a parcurs deja.",
        },
        {
          heading: "Bătaia și unghiul de 45°",
          body:
            "Pentru o lansare de la sol, distanța până unde cade bila se calculează cu R = v₀²·sin 2θ / g. Sinusul nu poate trece de 1, iar sin 2θ = 1 tocmai când 2θ = 90°, adică θ = 45°. De aceea 45° este unghiul care aruncă cel mai departe.",
        },
        {
          heading: "Perechile de unghiuri care dau aceeași bătaie",
          body:
            "30° și 60° trimit bila exact la aceeași distanță, deși pe drumuri care arată complet diferit: unul jos și întins, celălalt înalt și scurt. Motivul este că sin 60° și sin 120° sunt egale. La fel se întâmplă cu 20° și 70°, sau cu 40° și 50° — perechile care adunate dau 90°.",
        },
      ],
      try: [
        "Pune înălțimea pe 0 și păstrează viteza. Încearcă 30°, apoi 60°: bătaia este identică, deși traiectoriile arată complet diferit.",
        "Du unghiul la 45°. Pentru viteza aleasă, aici bătaia este cea mai mare pe care o poți obține.",
        "Urmărește afișajul în timp ce bila zboară: vx rămâne același tot timpul, iar vy trece prin zero exact în punctul roșu din vârf.",
        "Ridică înălțimea de lansare peste 0. Acum unghiul cel mai bun coboară sub 45°, pentru că bila pornește deja cu un avans pe verticală.",
      ],
    },

    en: {
      blocks: [
        {
          heading: "Two motions at once",
          body:
            "Throw a ball and watch it closely: it travels forward and, at the same time, rises and then falls. Those are two motions layered on top of each other, one horizontal and one vertical. The dashed grey arrows beside the ball show exactly those two parts of its velocity, and neither affects the other.",
        },
        {
          heading: "Sideways, the speed never changes",
          body:
            "Nothing pushes the ball forward and nothing slows it down sideways, because this model leaves out air resistance. That is why the readout says “vx constant”: the ball moves sideways at the same rate from launch until it lands.",
        },
        {
          heading: "Vertically, gravity changes everything",
          body:
            "The vertical speed drops relentlessly, by 9.8 m/s every second. At first the ball climbs, the vertical speed reaches exactly zero at the top — the red dot on the drawing — then turns negative, and the ball falls faster and faster.",
        },
        {
          heading: "Why the path is a parabola",
          body:
            "Combine steady motion sideways with accelerating motion vertically and you get precisely the curve drawn here: a parabola. The faded part shows the whole journey the ball is going to make, and the solid part how much of it is already done.",
        },
        {
          heading: "Range and the 45° angle",
          body:
            "For a launch from ground level, how far the ball lands is given by R = v₀²·sin 2θ / g. Sine can never exceed 1, and sin 2θ = 1 exactly when 2θ = 90°, that is θ = 45°. This is why 45° throws the furthest.",
        },
        {
          heading: "Angle pairs that reach equally far",
          body:
            "30° and 60° send the ball exactly the same distance, along paths that look nothing alike: one low and stretched, the other high and short. The reason is that sin 60° and sin 120° are equal. The same holds for 20° and 70°, or 40° and 50° — the pairs that add up to 90°.",
        },
      ],
      try: [
        "Set the height to 0 and keep the speed. Try 30°, then 60°: the range is identical, even though the arcs look completely different.",
        "Take the angle to 45°. For the speed you have chosen, this is the furthest the ball can possibly go.",
        "Watch the readout while the ball flies: vx stays the same throughout, and vy passes through zero exactly at the red dot on top.",
        "Raise the launch height above 0. Now the best angle drops below 45°, because the ball already starts with a head start upward.",
      ],
    },
  },

  "unit-circle": {
    ro: {
      blocks: [
        {
          heading: "Cercul are raza exact 1",
          body:
            "De aceea îi spunem cerc trigonometric (sau cercul unitate). Orice punct de pe el se află la distanța 1 față de centru. Linia albastră care merge din centru până la punct este raza, deci are mereu lungimea 1 — oricât ai roti.",
        },
        {
          heading: "Unde stau sinusul și cosinusul",
          body:
            "Când miști unghiul θ, punctul albastru se plimbă pe cerc. Segmentul roșu arată cât de departe este punctul pe orizontală: acesta este cos θ. Segmentul verde arată cât de sus este punctul: acesta este sin θ. Pe scurt, punctul are coordonatele (cos θ, sin θ) — exact perechea afișată lângă el.",
        },
        {
          heading: "Legătura cu triunghiul dreptunghic",
          body:
            "Știi deja că într-un triunghi dreptunghic sinusul este cateta opusă împărțită la ipotenuză. Aici ipotenuza este raza, iar raza este 1. Orice număr împărțit la 1 rămâne neschimbat, așa că împărțirea dispare: cateta verticală este direct sin θ, iar cea orizontală este direct cos θ. Asta câștigi când lucrezi pe cercul cu raza 1.",
        },
        {
          heading: "De ce cos²θ + sin²θ = 1",
          body:
            "Triunghiul roșu-verde de pe cerc este dreptunghic — vezi unghiul drept marcat în colț. Teorema lui Pitagora spune că suma pătratelor catetelor este egală cu pătratul ipotenuzei. Catetele sunt cos θ și sin θ, iar ipotenuza este 1. Deci cos²θ + sin²θ = 1. Rotește cât vrei: numărul de sus rămâne 1.",
        },
        {
          heading: "Unda din dreapta",
          body:
            "Graficul din dreapta este construit din înălțimile punctului. Pentru fiecare unghi notăm cât de sus se află punctul și așezăm valoarea mai la dreapta. Linia punctată îți arată că este exact aceeași înălțime, dusă orizontal. Parcurgând tot cercul, înălțimile desenează unda sinusoidală.",
        },
        {
          heading: "Gândește-te la roata mare din parc",
          body:
            "Dacă stai într-un scaun al roții, sin θ îți spune cât de sus ești față de mijlocul roții, iar cos θ cât de mult ești deplasat lateral. La 90° ești fix în vârf, deci sin θ = 1. La 270° ești jos de tot, deci sin θ = −1. Unda din dreapta este chiar graficul înălțimii tale în timp ce roata se învârte.",
        },
      ],
      try: [
        "Pune θ = 0°. Punctul este la dreapta, pe axă: cos θ = 1, iar sin θ = 0, pentru că nu ești nici mai sus, nici mai jos de centru.",
        "Du unghiul la 90°. Acum sin θ = 1 și cos θ = 0 — ești fix în vârf, iar segmentul roșu a dispărut.",
        "Oprește-te la 45°. Sinusul și cosinusul sunt egale (≈ 0,71), fiindcă triunghiul are catetele egale.",
        "Treci de 180°. Sinusul devine negativ: punctul a coborât sub axă, iar unda din dreapta trece și ea sub linie.",
      ],
    },

    en: {
      blocks: [
        {
          heading: "The circle has radius exactly 1",
          body:
            "That is why it is called the unit circle. Every point on it sits at distance 1 from the centre. The blue line from the centre out to the point is the radius, so it is always 1 long — no matter how far you rotate.",
        },
        {
          heading: "Where sine and cosine live",
          body:
            "As you move the angle θ, the blue point travels around the circle. The red segment shows how far across the point is: that is cos θ. The green segment shows how high up it is: that is sin θ. So the point's coordinates are (cos θ, sin θ) — exactly the pair shown beside it.",
        },
        {
          heading: "How this links to the right triangle",
          body:
            "You already know that in a right triangle, sine is the opposite side divided by the hypotenuse. Here the hypotenuse is the radius, and the radius is 1. Dividing by 1 changes nothing, so the division disappears: the vertical side is simply sin θ and the horizontal side is simply cos θ. That is what working on a radius-1 circle buys you.",
        },
        {
          heading: "Why cos²θ + sin²θ = 1",
          body:
            "The red-and-green triangle on the circle is right-angled — you can see the square marker in its corner. Pythagoras says the squares of the two shorter sides add up to the square of the hypotenuse. Those sides are cos θ and sin θ, and the hypotenuse is 1. So cos²θ + sin²θ = 1. Rotate as much as you like: the number at the top stays 1.",
        },
        {
          heading: "The wave on the right",
          body:
            "The graph on the right is built from the point's heights. For each angle we note how high the point is, and place that value further to the right. The dashed line shows it is the very same height, carried across. Go all the way round and those heights trace out the sine wave.",
        },
        {
          heading: "Think of a Ferris wheel",
          body:
            "If you are sitting in one of the seats, sin θ tells you how high you are compared to the middle of the wheel, and cos θ how far to the side you are. At 90° you are right at the top, so sin θ = 1. At 270° you are at the bottom, so sin θ = −1. The wave on the right is simply the graph of your height as the wheel turns.",
        },
      ],
      try: [
        "Set θ = 0°. The point sits out on the axis: cos θ = 1 and sin θ = 0, because you are neither above nor below the centre.",
        "Take the angle to 90°. Now sin θ = 1 and cos θ = 0 — you are right at the top, and the red segment has vanished.",
        "Stop at 45°. Sine and cosine are equal (≈ 0.71), because the triangle has two sides the same length.",
        "Go past 180°. Sine turns negative: the point has dropped below the axis, and the wave on the right dips below the line too.",
      ],
    },
  },

  pendulum: {
    ro: {
      blocks: [
        {
          heading: "Ce îl trage înapoi",
          body:
            "Greutatea bobului, săgeata albastră mg, arată mereu drept în jos. Firul nu o poate anula decât pe bucata îndreptată de-a lungul lui — partea desenată punctat. Ce rămâne este săgeata roșie mg·sin θ, singura care împinge bobul înapoi spre mijloc. Urmărește-o: la capătul cursei este cea mai lungă, iar în punctul cel mai de jos dispare complet. Acolo nu mai trage nimic de bob — dar tocmai acolo el se mișcă cel mai repede, pentru că a fost tras tot drumul până acolo.",
        },
        {
          heading: "De ce masa nu schimbă nimic",
          body:
            "Trage cursorul de masă de la 0,5 kg la 5 kg în timp ce pendulul oscilează. Bobul se face vizibil mai mare, săgețile forțelor cresc — și ritmul nu se clintește deloc. Un bob de zece ori mai greu este tras de zece ori mai tare, dar este și de zece ori mai greu de pus în mișcare. Cele două efecte se anulează exact, la fel ca la planul înclinat, unde masa dispărea din condiția de alunecare.",
        },
        {
          heading: "Lungimea decide totul",
          body:
            "Singurul cursor care schimbă cu adevărat perioada este lungimea: T = 2π·√(L/g). Fiind sub radical, lungimea trebuie mărită de patru ori ca perioada să se dubleze. Poți verifica asta chiar pe cursor: la 0,40 m perioada este 1,27 s, iar la 1,60 m — de patru ori mai lung — este 2,54 s, exact dublu.",
        },
        {
          heading: "Graficul de jos",
          body:
            "Banda de jos notează unghiul bobului clipă de clipă și îl împinge spre stânga, ca o bandă de hârtie care se derulează. Rezultatul este aceeași undă pe care ai văzut-o la cercul trigonometric — nu din întâmplare, ci pentru că un pendul mic se leagănă exact ca un punct care se rotește uniform. Paranteza mov de dedesubt măsoară o perioadă completă: perioada nu mai e doar un număr, ci o distanță pe care o poți privi cum se lungește când tragi de cursorul lungimii.",
        },
        {
          heading: "Unde formula începe să greșească",
          body:
            "Formula T = 2π·√(L/g) nu este exactă — este valabilă doar pentru unghiuri mici, unde arcul pe care se mișcă bobul este aproape o linie dreaptă. De aceea desenul îți arată și perioada măsurată, cronometrată din mișcarea reală. La 20° cele două valori diferă cu sub 1% și nici nu observi. La 80° pendulul real este cu aproape 14% mai lent decât promite formula, iar cifra se colorează în roșu ca să nu-ți scape.",
        },
        {
          heading: "De aici vin ceasurile cu pendul",
          body:
            "Timp de aproape trei secole, cele mai precise ceasuri din lume au fost pendule — tocmai pentru că perioada depinde doar de lungime și de g, două mărimi care nu se schimbă singure. Un ceasornicar care voia să regleze ceasul urca sau cobora bobul pe tijă cu câțiva milimetri. Nu i-ar fi folosit la nimic să pună un bob mai greu, și acum știi de ce.",
        },
      ],
      try: [
        "Pune lungimea pe 0,40 m și uită-te la paranteza de sub grafic: T = 1,27 s. Treci apoi pe 1,60 m — de patru ori mai lung. Perioada devine 2,54 s, exact dublă, iar paranteza se lățește sub ochii tăi.",
        "Lasă animația să meargă și trage cursorul de masă de la 0,5 kg până la 5 kg. Bobul crește, săgeata mg se lungește — dar perioada măsurată nu se schimbă cu nicio sutime.",
        "Pune unghiul de pornire pe 10°: perioada măsurată este practic egală cu cea din formulă. Urcă-l la 80° și cifra sare cu aproape 14% peste formulă și se face roșie — formula era doar pentru unghiuri mici.",
        "Oprește animația exact când bobul trece prin punctul cel mai de jos. Săgeata roșie mg·sin θ a dispărut: nimic nu îl mai trage lateral, deși acolo se mișcă cel mai repede.",
      ],
    },

    en: {
      blocks: [
        {
          heading: "What pulls it back",
          body:
            "The bob's weight, the blue mg arrow, always points straight down. The string can only cancel the part of it that lies along the string — the piece drawn dashed. What is left over is the red mg·sin θ arrow, and it is the only thing pushing the bob back toward the middle. Watch it: it is longest at the ends of the swing and vanishes completely at the lowest point. Nothing is pulling the bob sideways down there — yet that is exactly where it moves fastest, because it has been pulled all the way there.",
        },
        {
          heading: "Why mass changes nothing",
          body:
            "Drag the mass slider from 0.5 kg to 5 kg while the pendulum is swinging. The bob visibly grows, the force arrows get longer — and the rhythm does not shift at all. A bob ten times heavier is pulled ten times harder, but it is also ten times harder to get moving. The two effects cancel exactly, just as they did on the inclined plane, where mass dropped out of the sliding condition.",
        },
        {
          heading: "Length decides everything",
          body:
            "The only slider that really changes the period is the length: T = 2π·√(L/g). Because the length sits under a square root, you have to make it four times longer to double the period. You can check that on the slider itself: at 0.40 m the period is 1.27 s, and at 1.60 m — four times longer — it is 2.54 s, exactly double.",
        },
        {
          heading: "The graph underneath",
          body:
            "The strip at the bottom writes down the bob's angle moment by moment and scrolls it leftward, like paper unrolling under a pen. What comes out is the same wave you met on the unit circle — not by coincidence, but because a small pendulum swings exactly like a point going round a circle at a steady rate. The purple bracket below measures one whole period: the period stops being a number and becomes a distance you can watch stretch as you drag the length slider.",
        },
        {
          heading: "Where the formula starts to be wrong",
          body:
            "T = 2π·√(L/g) is not exact — it only holds for small angles, where the arc the bob travels is nearly a straight line. That is why the drawing also shows you a measured period, timed off the real motion. At 20° the two differ by under 1% and you would never notice. At 80° the real pendulum is nearly 14% slower than the formula promises, and the number turns red so you can't miss it.",
        },
        {
          heading: "This is where pendulum clocks come from",
          body:
            "For nearly three centuries the most accurate clocks in the world were pendulums — precisely because the period depends only on length and on g, two things that don't drift on their own. A clockmaker who wanted to correct a clock moved the bob a few millimetres up or down its rod. Fitting a heavier bob would have done nothing at all, and now you know why.",
        },
      ],
      try: [
        "Set the length to 0.40 m and look at the bracket under the graph: T = 1.27 s. Now go to 1.60 m — four times longer. The period becomes 2.54 s, exactly double, and the bracket widens in front of you.",
        "Leave it running and drag the mass slider from 0.5 kg all the way to 5 kg. The bob grows, the mg arrow lengthens — and the measured period does not budge by a hundredth of a second.",
        "Set the start angle to 10°: the measured period is essentially the formula's. Raise it to 80° and the number jumps nearly 14% above the formula and turns red — the formula was only ever for small angles.",
        "Pause the animation just as the bob passes the lowest point. The red mg·sin θ arrow has vanished: nothing is pulling it sideways, even though that is where it is moving fastest.",
      ],
    },
  },
};
