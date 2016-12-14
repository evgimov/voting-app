import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

//returns new list of entries
export function setEntries(state, entries){
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pair'); // get the value of a list
  const aVotes = vote.getIn(['tally', a], 0); // get  value with index 0 in nested map
  const bVotes = vote.getIn(['tally', b], 0);
  if      (aVotes > bVotes)  return [a];
  else if (aVotes < bVotes)  return [b];
  else                       return [a, b];
}
// get next pair of entries
export function next(state) {
  const entries = state.get('entries')
    .concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state.remove('vote')
      .remove('entries')
      .set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({pair: entries.take(2)}), //returns the first 2 entries from entries map
      entries: entries.skip(2)  // returns the entries excluding first 2
    });
  }
}

export function vote(voteState, entry) {
  if (voteState.get('pair').includes(entry)){
    return voteState.updateIn(
      ['tally', entry],
      0,
      tally => tally + 1
    );
  }else{
    return voteState;
  }
}

