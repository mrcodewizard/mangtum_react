import {useState, useEffect} from 'react';
// import SearchList from './searchList.json';
import {NavLink} from "react-router-dom";

const SuggestionsList = ({suggestions, inputValue, onSelectSuggestion, displaySuggestions, searchTerm, setSearchTerm, noNavigation}) => {
  if (inputValue && displaySuggestions) {
    if (suggestions.length > 0) {
      return (
        <ul className='autocomplete'>
          {suggestions.map((suggestion, index) => {
            if (index < 8) {
              const searchTermIndex = suggestion.name.toLowerCase().indexOf(searchTerm.value?.toLowerCase())
              const matchedTextFromSuggestion = suggestion.name.substr(searchTermIndex, searchTerm.value.length)
              const textBeforeMatchedText = suggestion.name.substr(0, searchTermIndex)
              const textAfterMatchedText = suggestion.name.substr(searchTermIndex + searchTerm.value.length)
              return (
                <NavLink to={ noNavigation ? '' : `/search?q=${suggestion}`} onClick={() => { setSearchTerm({
                  clicked:true, value:suggestion
                })}}  key={suggestion.id}>
                  <li
                    onClick={() => onSelectSuggestion(index)}
                    className=""
                  >
                    {textBeforeMatchedText}<span
                    className="bold">{matchedTextFromSuggestion}</span>{textAfterMatchedText}
                  </li>
                </NavLink>
              );
            }
          })}
        </ul>
      );
    } else {
      return <div className="no-sugesstions">No suggestions available...</div>;
    }
  }
};


const Autocomplete = ({
                        searchTerm, setSearchTerm
                      }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [displaySuggestions, setDisplaySuggestions] = useState(false);


  const suggestions = [
    {name: 'apple', id:'1'}, {name: 'peas', id:'2'}
  ]

  const searchItem = searchTerm => {
    if(searchTerm.value.length > 0){
      setInputValue(searchTerm);
    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
    setFilteredSuggestions(filteredSuggestions);
    setDisplaySuggestions(true);
    }
    else{
    setDisplaySuggestions(false);
    }
  };


  useEffect(() => {
    searchItem(searchTerm)
  }, [searchTerm]);

  const onSelectSuggestion = index => {
    setSelectedSuggestion(index);
    setInputValue(filteredSuggestions[index]);
    setFilteredSuggestions([]);
    setDisplaySuggestions(false);
  };

  return (
    <>
      <SuggestionsList
        inputValue={inputValue}
        selectedSuggestion={selectedSuggestion}
        onSelectSuggestion={onSelectSuggestion}
        displaySuggestions={displaySuggestions}
        suggestions={filteredSuggestions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        noNavigation={false}
      />
    </>
  );
};

export default Autocomplete;