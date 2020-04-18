import reducer, {FINALIZE_SELECTION, getInitialState, NEW_GAME, ROLL_DICE, TOGGLE_CHOICE} from '../gameReducer';

describe('reducer', function () {
  describe('initial state', function () {
    it('should have the initial state', function () {
      expect(getInitialState()).toEqual({
        dice: [],
        availableChoices: new Set([1,2,3,4,5,6,7,8,9]),
        pickingNumbers: false,
        needsToRoll: true,
        selectedNumbers: new Set(),
        gameOver: false,
        winner: false,
      })
    });

    it('should take dice as an arg to initialize with', function () {
      expect(getInitialState([1,6])).toEqual({
        dice: [1, 6],
        availableChoices: new Set([1,2,3,4,5,6,7,8,9]),
        pickingNumbers: false,
        needsToRoll: true,
        selectedNumbers: new Set(),
        gameOver: false,
        winner: false,
      })
    });
  });

  describe('roll dice', function () {
    let readyToRollState;
    beforeEach(() => {
      readyToRollState = getInitialState([1,2]);
    });

    it('should return same state if game is over', function () {
      readyToRollState.gameOver = true;
      const newState = reducer(readyToRollState, {type: ROLL_DICE});
      expect(newState).toEqual(readyToRollState);
    });

    it('should return same state if not rolling', function () {
      readyToRollState.needsToRoll = false;
      const newState = reducer(readyToRollState, {type: ROLL_DICE});
      expect(newState).toEqual(readyToRollState);
    });

    describe('number of dice rolled', function () {
      it('should roll two dice if the available numbers sum to 6+', function () {
        readyToRollState.availableChoices = new Set([1,2,3]);
        const newState = reducer(readyToRollState, {type: ROLL_DICE});
        expect(newState.dice.length).toEqual(2);
      });

      it('should roll one die if the available numbers sum to less than 6', function () {
        readyToRollState.availableChoices = new Set([2,3]);
        const newState = reducer(readyToRollState, {type: ROLL_DICE});
        expect(newState.dice.length).toEqual(1);
      });
    });

    describe('game over followup', function () {
      xit('should test game over states', function () {

      });
    });
  });

  describe('toggle choice', function () {
    let toggleChoiceState;
    const toggleNumber = 4;
    beforeEach(() => {
      toggleChoiceState = getInitialState([3,2]);
      toggleChoiceState.pickingNumbers = true;
    });

    it('should not do anything if game is over', function () {
      toggleChoiceState.gameOver = true;
      const newState = reducer(toggleChoiceState, {type: TOGGLE_CHOICE, payload: toggleNumber});
      expect(newState).toEqual(toggleChoiceState);
    });

    it('should not do anything if not picking numbers', function () {
      toggleChoiceState.pickingNumbers = false;
      const newState = reducer(toggleChoiceState, {type: TOGGLE_CHOICE, payload: toggleNumber});
      expect(newState).toEqual(toggleChoiceState);
    });

    it('should not do anything if number does not exist in availbleChoices', function () {
      toggleChoiceState.availableChoices = new Set([1,2,3,5]);
      const newState = reducer(toggleChoiceState, {type: TOGGLE_CHOICE, payload: toggleNumber});
      expect(newState).toEqual(toggleChoiceState);
    });

    it('should add the choice to the selectedNumbers', function () {
      expect(toggleChoiceState.selectedNumbers.has(toggleNumber)).toEqual(false);
      const newState = reducer(toggleChoiceState, {type: TOGGLE_CHOICE, payload: toggleNumber});
      expect(newState.selectedNumbers.has(toggleNumber)).toEqual(true);
    });

    it('should remove the choice from selectedNumbers', function () {
      toggleChoiceState.selectedNumbers.add(toggleNumber);
      expect(toggleChoiceState.selectedNumbers.has(toggleNumber)).toEqual(true);
      const newState = reducer(toggleChoiceState, {type: TOGGLE_CHOICE, payload: toggleNumber});
      expect(newState.selectedNumbers.has(toggleNumber)).toEqual(false);
    });
  });

  describe('finalize selection', function () {
    let finalizeSelectionState;
    const initialAvailableChoices = new Set([1,2,3,4]);
    const rolledDice = [1,4];
    beforeEach(() => {
      finalizeSelectionState = getInitialState(rolledDice);
      finalizeSelectionState.pickingNumbers = true;
      finalizeSelectionState.needsToRoll = false;
      finalizeSelectionState.availableChoices = initialAvailableChoices;
    });

    it('should not do anything if game is over', function () {
      finalizeSelectionState.gameOver = true;
      const newState = reducer(finalizeSelectionState, {type: FINALIZE_SELECTION});
      expect(newState).toEqual(finalizeSelectionState);
    });

    it('should not do anything if user needs to roll', function () {
      finalizeSelectionState.needsToRoll = true;
      const newState = reducer(finalizeSelectionState, {type: FINALIZE_SELECTION});
      expect(newState).toEqual(finalizeSelectionState);
    });

    it('should not do anything if invalid numbers selected', function () {
      finalizeSelectionState.selectedNumbers = new Set([5]);
      let newState = reducer(finalizeSelectionState, {type: FINALIZE_SELECTION});
      expect(newState).toEqual(finalizeSelectionState);
    });

    it('should not do anything if values do not add up', function () {
      finalizeSelectionState.selectedNumbers = new Set([1,2]);
      const newState = reducer(finalizeSelectionState, {type: FINALIZE_SELECTION});
      expect(newState).toEqual(finalizeSelectionState);
    });

    it('should not do anything if not picking numbers', function () {
      finalizeSelectionState.pickingNumbers = false;
      const newState = reducer(finalizeSelectionState, {type: FINALIZE_SELECTION});
      expect(newState).toEqual(finalizeSelectionState);
    });

    it('should remove the numbers that were selected', function () {
      finalizeSelectionState.selectedNumbers = new Set([1,4]);
      const newState = reducer(finalizeSelectionState, {type: FINALIZE_SELECTION});
      expect(newState.availableChoices).toEqual(new Set([2,3]));
    });

    it('should update to winner if no numbers remain', function () {
      finalizeSelectionState.availableChoices = new Set([1,4]);
      finalizeSelectionState.selectedNumbers = new Set([1,4]);
      const newState = reducer(finalizeSelectionState, {type: FINALIZE_SELECTION});
      expect(newState.availableChoices).toEqual(new Set());
      expect(newState.winner).toEqual(true);
    });
  });

  describe('new game', function () {
    it('should return the initial state', function () {
      const initialState = getInitialState();
      const newState = reducer(initialState, {type: NEW_GAME});
      expect(newState).toEqual(initialState);
    });

    it('should preserve previous dice state', function () {
      const oldDice = [1,2];
      let initialState = getInitialState(oldDice);
      const newState = reducer(initialState, {type: NEW_GAME});
      expect(newState.dice).toEqual([1,2]);
    });
  });
});