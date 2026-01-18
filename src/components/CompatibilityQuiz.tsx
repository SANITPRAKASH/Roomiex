import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { lifestyleQuestions } from '@/data/rooms'
import { Sparkles, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function CompatibilityQuiz() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const handleSeeMatchingRooms = () => {
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers))
    navigate('/rooms')
  }

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQuestion < lifestyleQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setTimeout(() => setIsComplete(true), 300)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
  }

  const progress = ((Object.keys(answers).length) / lifestyleQuestions.length) * 100

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3" />
              AI-Powered Matching
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Perfect{" "}
              <span className="text-gradient">Flatmate Match</span>
            </h2>
            <p className="text-muted-foreground">
              Answer a few quick questions about your lifestyle. We'll find rooms with compatible flatmates.
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Quiz Card */}
          <div className="card-elevated p-8 min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Question Counter */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {lifestyleQuestions.length}
                    </span>
                    <button 
                      onClick={resetQuiz}
                      className="text-sm  text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Start Over
                    </button>
                  </div>

                  {/* Question */}
                  <h3 className="text-xl md:text-2xl font-semibold mb-8">
                    {lifestyleQuestions[currentQuestion].question}
                  </h3>

                  {/* Options */}
                  <div className="flex-1 flex flex-col gap-3">
                    {lifestyleQuestions[currentQuestion].options.map((option) => {
                      const isSelected = answers[lifestyleQuestions[currentQuestion].id] === option.value
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(lifestyleQuestions[currentQuestion].id, option.value)}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left
                            ${isSelected 
                              ? "border-primary bg-primary-light" 
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                        >
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-medium flex-1">{option.label}</span>
                          {isSelected && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  {/* Success Animation */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-glow">
                    <Check className="w-10 h-10 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Profile Complete!</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    We've analyzed your preferences. Now let's find rooms with flatmates who share your lifestyle.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                    <Button variant="default" size="lg" className="flex-1 gap-2" onClick={handleSeeMatchingRooms}>
                      See Matching Rooms
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={resetQuiz}>
                      Retake Quiz
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}