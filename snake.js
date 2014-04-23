
angular.module('ngSnake', [])

  .controller('snakeCtrl', function($scope, $timeout, $window) { 
    var LEFT = 1, UP = 2, RIGHT = 3, DOWN = 4,
        boardSize = 20, interval = 170,
        tempDirection = LEFT, GAME_OVER = false;

    $scope.snake = {direction: LEFT, parts: []};
    $scope.fruit = {x:-1,y:-1};
    $scope.score = 0;
    $scope.board = [];

    // Setup game board
    for (var i = 0; i < boardSize; i++) {
      $scope.board[i] = [];
      for (var j = 0; j < boardSize; j++) {
        $scope.board[i][j] = 0;
      }
    }

    $scope.setStyling = function(row, col) {
      if (GAME_OVER) {
        return {"backgroundColor":"#FF2121"};
      }
      else if ($scope.fruit.x == col && $scope.fruit.y == row) {
        return {"backgroundColor": "#0FFF17"};
      }
      var parts = $scope.snake.parts;
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].x == col && parts[i].y == row) {
          return {"backgroundColor":"#FF2121"};
        }
      };
      return {"backgroundColor":"#000"};
    }

    function update() {
      var newPart = angular.copy($scope.snake.parts[0]);

      $scope.snake.direction = tempDirection;
      if (tempDirection === LEFT)
          newPart.x -= 1;
      else if (tempDirection === RIGHT)
          newPart.x += 1;
      else if (tempDirection === UP)
          newPart.y -= 1
      else if (tempDirection === DOWN)
          newPart.y += 1;

      if (boardCollision(newPart) || selfCollision(newPart)) {
        GAME_OVER = true;
        $timeout(function() {
          GAME_OVER = false;
        },500);
        return;
      } 
      else if (newPart.x === $scope.fruit.x && newPart.y === $scope.fruit.y) {
        $scope.score++;
        if ($scope.score % 5 === 0) {
          interval -= 20;
        }
        var tail = angular.copy($scope.snake.parts[$scope.snake.parts.length-1]);
        $scope.snake.parts.push(tail);
        resetFruit();
      }

      $scope.snake.parts.pop();
      $scope.snake.parts.unshift(newPart);

      $timeout(function() {
        update();
      }, interval);
    }

    function boardCollision(part) {
       if(part.x === boardSize || part.x === -1 || 
        part.y === boardSize || part.y === -1 ) {
        return true;
      }
      return false;
    }

    function selfCollision(part) {
      var parts = $scope.snake.parts;
      for (var i = 0; i < parts.length; i++) {
        if (part.x === parts[i].x && part.y === parts[i].y) {
          return true;
        }
      }
      return false;
    }

    function resetFruit() {
      var x = Math.floor(Math.random()*(boardSize));
      var y = Math.floor(Math.random()*(boardSize));

      var parts = $scope.snake.parts;
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].x === x && parts[i].y === y) {
          return resetFruit();
        }
      }
      $scope.fruit = {x:x, y:y};
    }

    $window.addEventListener("keyup", function(e) {
      if (e.keyCode == 37 && $scope.snake.direction !== RIGHT) 
        tempDirection = LEFT;
      else if (e.keyCode == 38 && $scope.snake.direction !== DOWN) 
        tempDirection = UP;
      else if (e.keyCode == 39 && $scope.snake.direction !== LEFT) 
        tempDirection = RIGHT;
      else if (e.keyCode == 40 && $scope.snake.direction !== UP) 
        tempDirection = DOWN;
    });

    $scope.startGame = function() {
      $scope.snake = {direction: LEFT, parts: []};
      $scope.fruit = {x:-1,y:-1};
      $scope.score = 0;
      GAME_OVER = false;

      // Set up initial snake
      for (var i = 0; i < 5; i++) {
        $scope.snake.parts.push({x: 10 + i, y: 10});
      }
      resetFruit();
      update();
    }

  });