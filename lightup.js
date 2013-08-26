$(document).ready(function() {
  var input = ''

  var checkInput = function() {
    return input && input != '';
  };

  var drawPuzzle = function() {
    var formatInput = input.split('\n');
    var width = parseInt(formatInput[0]);
    var height = parseInt(formatInput[1]);
    var puzzle = $('#puzzle');

    puzzle.empty();
    for(var i = 0; i < height; i++) {
      puzzle.append('<tr class="puzzle_row" row=' + (height - i) + '></tr>');
    }

    for(var i = 1; i <= height; i++) {
      var row = $('[row=' + i + ']');
      for(var j = 1; j <= width; j++) {
        row.append('<td class="puzzle_cell" col=' + j + '></td>');
      }
    }

    addBlackCells(formatInput);
    addBulbs();
    addLitCells();
  }

  var addBlackCells = function(formatInput) {
    var lineFormat, x, y, adjacentNum, i, cell;

    for(i = 2; i < formatInput.length; i++) {
      lineFormat = formatInput[i].split(' ');
      x = lineFormat[0];
      y = lineFormat[1];
      adjacentNum = lineFormat[2];

      cell = getCell(x,y);
      cell.addClass('black_cell');
      if(adjacentNum != 5) {
        cell.append('<p class="cell_number">' + adjacentNum + '</p>');
      }
    }
  };

  var addBulbs = function() {
    var solution, bulbX, bulbY, lineFormat;

    solution = $('#light_up_output').val().split('\n');
    for(var i = 1; i < solution.length; i++) {
      lineFormat = solution[i].split(' ');
      x = lineFormat[0];
      y = lineFormat[1];

      cell = getCell(x,y);
      cell.addClass('bulb');
    }
  };

  var addLitCells = function(height, width) {
    var x,y;
    $('.bulb').each(function(idx, bulb) {
      x = parseInt($(bulb).attr('col'));
      y = parseInt($(bulb).parent().attr('row'));
      lightCellsFromIter(x, y, function(p_x, p_y) { return {x:p_x+1, y:p_y }; });
      lightCellsFromIter(x, y, function(p_x, p_y) { return {x:p_x-1, y:p_y }; });
      lightCellsFromIter(x, y, function(p_x, p_y) { return {x:p_x,   y:p_y+1 }; });
      lightCellsFromIter(x, y, function(p_x, p_y) { return {x:p_x,   y:p_y-1 }; });
    });
  }

  var lightCellIfValid = function(x, y) {
    var cell = getCell(x,y);
    if(cell && cell.hasClass('black_cell')) {
      return false;
    } else {
      cell.addClass('lit_cell');
      return true;
    }
  }

  var lightCellsFromIter = function(x, y, iter) {
    if(lightCellIfValid(x,y)) {
      var xyPair = iter(x,y);
      lightCellsFromIter(xyPair.x, xyPair.y, iter);
    }
  }

  var getCell = function(x, y) {
    var cell = $('[row=' + y + '] [col=' + x + ']');
    return cell == [] ? undefined : cell;
  };

  $('#submit_light_up').click(function() {
    input = $('#light_up_input').val();
    if(checkInput()) {
      drawPuzzle();
    } else {

    }
  });
});