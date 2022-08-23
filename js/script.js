const pokemonName = document.querySelector('.pokemon__name')
const pokemonNumber = document.querySelector('.pokemon__number')
const pokemonImage = document.querySelector('.pokemon__image')

const form = document.querySelector('.form')
const input = document.querySelector('.input__search')

const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')

let searchPokemon = 1

const fetchPokemon = async (pokemon) => {

    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    
    if (APIResponse.status === 200){
        const data = await APIResponse.json()
        return data
    }
}

const renderPokemon = async (pokemon) => {

    pokemonName.innerHTML = 'Loading...'
    pokemonNumber.innerHTML = ''
    
    const data = await fetchPokemon(pokemon)

    if(data){
        pokemonImage.style.display = 'block'
        pokemonName.innerHTML = data.name
        pokemonNumber.innerHTML = data.id
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default']

        input.value = ''
        searchPokemon = data.id
        pokedex__voice(data)
    }
    else{
        pokemonImage.style.display = 'none'
        pokemonName.innerHTML = 'Not Found'
        pokemonNumber.innerHTML = ''
    }
}

form.addEventListener('submit', (event) => {

    event.preventDefault()
    renderPokemon(input.value.toLowerCase())
})

btnPrev.addEventListener('click', () => {
    if(searchPokemon > 1){
        searchPokemon -= 1
        renderPokemon(searchPokemon)
    }
})

btnNext.addEventListener('click', () => {
    searchPokemon += 1
    renderPokemon(searchPokemon)
})

renderPokemon(searchPokemon)

const pokedex__voice = (pokemon) => {
    // Impede que os dados de um pokemon sobreponha 
    // o de outro caso o botão seja apetado várias vezes seguidas 
    window.speechSynthesis.cancel() 

    // Initialize new SpeechSynthesisUtterance object
    let speech = new SpeechSynthesisUtterance();

    // Set Speech Language
    speech.lang = "en";

    let voices = window.speechSynthesis.getVoices()

    speech.voice = voices[4]

    array = pokedex__voice_text(pokemon)
    
    array.forEach(element => {
        speech.text = element
        window.speechSynthesis.speak(speech)
    })
}

const pokedex__voice_text = (pokemon) => {
    let text = ""

    let types = pokemon["types"]
    let arr_types = []

    types.forEach(element => {
        arr_types.push(element["type"]["name"])
    })

    if(arr_types.length > 1){
        text = [pokemon.name, `Types: ${arr_types[0]} and ${arr_types[1]}`]
    }
    else {
        text = [pokemon.name, `Type: ${arr_types[0]}`]
    }

    return text
}