import random

class MathMode:
    def __init__(self, num_of_digits):
       self. num_of_digits = num_of_digits
       self.score_counter = 0
       self.question_counter = 0

    def question_solver(self, op, num1, num2):
        if op == "+":
           return num1 + num2
        elif op == "-":
           return num1 - num2
        elif op == "x":
           return num1 * num2
        elif op == "÷":
           return round(num1/num2, 2)
        else:
           return "Invalid operation"
    
    def question_generator(self, op):
        num1 = random_number_picker
        num2 = random_number_picker
        
        ans = input(f"{num1} {op} {num2} = ")
        try:
            if ans == "end":
                return ans
            
            ans = int(ans)
            correct_ans = question_solver(op, num1, num2)
            if ans == correct_ans:
                self.score_counter += 1
                print("You're correct!!")
            else:
                print("You're incorrect")
                print(f"The Correct Answer is {correct_ans}"
            self.question_counter += 1
        
       except ValueError as e:
            print("Invalid input type -- only numbers allowed")
        except Exception as e:
            print("Invalid input")
        return None
    
    def summarize_score(self):
       return f"You got {self.score_counter}/{self.question_counter}"
    
    def random_number_picker(self):
        return random.randrange(0,(10**num_of_digits))
        

class GameMode(MathMode):
    def __init__(self, num_of_digits):
        super().__init__(num_of_digits)
    
    def game_question(self):
        operations = ["+", "-", "x", "÷"]
        op_choice = random.choice(operations)
        return question_generator(op_choice)
        

class PracticeMode(MathMode):
    def __init__(self, num_of_digits, init_op):
        super().__init__(num_of_digits)
        self.op = init_op
    
    def change_operation(self, op):
        self.op = op
    
    def practice_question(self):
        return question_generator(self.op)