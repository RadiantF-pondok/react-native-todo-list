import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import FloatingActionBar from '../../components/FloatingActionBar';
import {styles} from '../../styles/styles';

export class TodoAsync extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      todos: [
        {
          task: 'Belajar React Native',
          checked: false,
        },
        {
          task: 'Belajar Async Storage',
          checked: false,
        },
        {
          task: 'Belajar API',
          checked: false,
        },
      ],
      showModal: false,
    };
  }

  addTodo() {
    const {input, todos} = this.state;

    if (input == '') {
      alert('Tolong isi');
    } else {
      this.setState({
        todos: [{task: input, checked: false}, ...todos],
        showModal: false,
      });
    }
    this.storeData();
  }

  deleteTodo(id) {
    const {todos} = this.state;
    if (todos.length > 0) {
      this.setState({
        todos: todos.filter((todo, index) => index !== id),
      });
    } else {
      this.setState({
        todos: [],
      });
    }
    this.storeData();
  }

  checkTodo(id) {
    const {todos} = this.state;
    this.setState({
      todos: todos.map((todo, index) => {
        return {
          task: todo.task,
          checked: index == id ? !todo.checked : todo.checked,
        };
      }),
    });
    this.storeData();
  }

  showModal(visible) {
    this.setState({showModal: visible});
  }

  storeData = async () => {
    try {
      const todo = this.state.todos;
      await AsyncStorage.setItem('todo', JSON.stringify(todo));
    } catch (error) {
      console.log(error);
    }
  };

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('todo');
      if (value !== null) {
        // We have data!!
        // console.log(value);
        const data = JSON.parse(value);
        this.setState({todos: data});
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  };

  componentDidMount() {
    this.retrieveData();
  }

  render() {
    const {todos, showModal} = this.state;
    return (
      <View style={styles.screen}>
        <Modal visible={showModal} transparent={true} style={{flex: 1}}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeModal}>
              <Text
                style={styles.buttonText}
                onPress={() => this.showModal(false)}>
                x
              </Text>
            </TouchableOpacity>
            <Text style={styles.title}> Add Todo Here </Text>
            <TextInput
              style={[styles.input, styles.marginSmallV]}
              placeholderTextColor="#aaaaaa"
              placeholder="Task todo"
              onChangeText={(task) => this.setState({input: task})}
            />
            <TouchableOpacity
              style={[styles.button, styles.marginSmallV]}
              onPress={() => this.addTodo()}>
              {this.state.addLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Add Todo</Text>
              )}
            </TouchableOpacity>
          </View>
        </Modal>
        <ScrollView style={styles.contentWrapper}>
          <Text style={styles.title}>Todo AsyncStorage</Text>
          <View>
            <View style={styles.todoList}>
              <Text style={styles.text}>TODAY TASKS</Text>
              <View>
                {this.state.loading ? (
                  <ActivityIndicator color="red" />
                ) : todos.length === 0 ? (
                  <Text>Kosong</Text>
                ) : (
                  todos.map((todo, index) => (
                    <View style={styles.todo} key={index}>
                      <TouchableOpacity
                        onPress={() => {
                          this.showModal(index);
                        }}>
                        <Image
                          source={require('../../assets/icon/underline-button.png')}
                          style={styles.smallIcon}
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.text,
                          {
                            flex: 1,
                            textDecorationLine: todo.checked
                              ? 'line-through'
                              : 'none',
                          },
                        ]}>
                        {todo.task}
                      </Text>
                      <TouchableOpacity onPress={() => this.checkTodo(index)}>
                        <Image
                          source={
                            todo.checked
                              ? require('../../assets/icon/check-box.png')
                              : require('../../assets/icon/blank-check-box.png')
                          }
                          style={styles.smallIcon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.deleteTodo(index)}>
                        <Image
                          source={require('../../assets/icon/rubbish-bin-delete-button.png')}
                          style={styles.smallIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.floatActionBar}>
          <FloatingActionBar onPress={() => this.showModal(true)} />
        </View>
      </View>
    );
  }
}

export default TodoAsync;
