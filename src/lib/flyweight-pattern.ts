interface Pokemon {
  species: {
    name: string;
    url: string;
  };

}

interface PokemonList {
  count: number;
  next: string;
  previous?: any;
  results: {
    name: string;
    url: string;
  }[];
}

function makeURLFlyweights<RType>(
  urls: Record<string, string>
) {
  const obj: Record<string, Promise<RType>> = {};
  return new Proxy(obj, {
      get: (target, name: string) => {
          console.log(`Fetching ${name} ${urls[name]}`);
          if(!target[name]) {
              target[name] = fetch(urls[name]).then((val) => val.json());
          }
          return target[name];
      },
  })
}

(async () => {
  const pokemon = (await (await fetch('https://pokeapi.co/api/v2/pokemon/')).json()) as PokemonList;
  const urls = pokemon.results.reduce((acc: { [key: string]: string; }, { name, url}) => {
      acc[name] = url;
      return acc
  }, {});

  const lookup = makeURLFlyweights<Pokemon>(urls);
  const data = await lookup["pidgeot"];
  console.log(data.species);
})()