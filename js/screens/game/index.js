import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';
import { LinearGradient } from 'expo';
import QuestionView from './QuestionView';
import AnswerView from './AnswerView';
import Hearts from './Hearts';
import Diamonds from './Diamonds';
import theme from '../../utils/theme';
import { connect } from '../../context/connect';
// import { setPersistedStore } from '../../context/utils';

const PAUSE = 500;
const DEFAULT_LEVEL = 1;

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.props.setupGame(
      'hiragana',
      this.props.navigation.getParam('level', DEFAULT_LEVEL)
    );
  }

  componentDidUpdate(prevProps) {
    const { game, unlockedLevel, setupGame } = this.props;
    // console.log(game.level);
    // console.log(unlockedLevel);
    if (game.pending) {
      if (game.level > unlockedLevel) {
        setTimeout(() => {
          this.props.navigation.navigate('LevelSelection', {
            preselectedLevel: game.level
          });
          this.props.setPersistedStore({ unlockedLevel: game.level });
        }, PAUSE);
      } else {
        setTimeout(() => {
          // setupGame('hiragana', game.level);
        }, PAUSE);
      }
    }
  }

  checkAnswer = givenAnswer => {
    const { setGivenAnswer, game, navigation } = this.props;

    setGivenAnswer({
      ...givenAnswer,
      correct: game.correctAnswer.latinChar === givenAnswer.latinChar
    });
  };

  render() {
    const { game, navigation, setupGame } = this.props;

    return (
      <LinearGradient
        style={styles.container}
        colors={theme.color.gradient.primary}
      >
        {game.initialized ? (
          <React.Fragment>
            <View style={styles.statusContainer}>
              <Hearts lives={game.lives} />
              <Diamonds score={game.score} />
            </View>
            <QuestionView game={game} setupGame={setupGame} />
            <AnswerView
              answers={game.choices}
              correctAnswer={game.correctAnswer}
              givenAnswer={game.givenAnswer}
              checkAnswer={this.checkAnswer}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('Pause')}
              style={{ marginHorizontal: 25 }}
            >
              <Image
                style={{ width: 32, height: 23 }}
                source={require('../../../assets/back.png')}
              />
            </TouchableOpacity>
            <Text>level {game.level}</Text>
          </React.Fragment>
        ) : null}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    width: '100%'
  }
});

const mapStateToProps = ({ game, persistedStore }) => ({
  game,
  unlockedLevel: persistedStore.unlockedLevel
});

const mapActionToProps = ({ game, persistedStore }) => {
  return {
    setupGame: game.setupGame,
    setGivenAnswer: game.setGivenAnswer,
    checkGivenAnswer: game.checkGivenAnswer,
    setPersistedStore: persistedStore.setPersistedStore
  };
};

export default connect(mapStateToProps, mapActionToProps)(Game);
