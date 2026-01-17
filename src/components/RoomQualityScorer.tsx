import { useState } from 'react'
import { Upload, Sparkles, Loader2, AlertCircle, CheckCircle2, Sun, SprayCan, Maximize2, Wind, Sofa } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { analyzeRoomWithAI, type RoomAnalysis } from '@/lib/ai'
import { toast } from 'sonner'

const categoryIcons = {
  lighting: Sun,
  cleanliness: SprayCan,
  space: Maximize2,
  ventilation: Wind,
  furnishing: Sofa,
}

interface CategoryScoreCardProps {
  label: string
  score: number
  feedback: string
  Icon: React.ComponentType<{ className?: string }>
}

function CategoryScoreCard({ label, score, feedback, Icon }: CategoryScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600 dark:text-green-500'
    if (score >= 7) return 'text-primary'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 9) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 7) return 'bg-primary/10'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h4 className="text-sm font-medium text-foreground tracking-wide">
            {label}
          </h4>
        </div>
        <Badge className={`${getScoreBgColor(score)} ${getScoreColor(score)} border-0`}>
          {score.toFixed(1)}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feedback}
      </p>
    </div>
  )
}

export function RoomQualityScorer() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB')
      return
    }

    setError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setAnalysis(null)
  }

  const analyzeImage = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeRoomWithAI(imageFile)
      setAnalysis(result)
      toast.success('Room analysis complete!')
    } catch (err) {
      console.error('Analysis error:', err)
      toast.error('Failed to analyze image. Please try again.')
      setError('Failed to analyze image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setImageFile(null)
    setImagePreview(null)
    setAnalysis(null)
    setError(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge variant="outline" className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          AI-Powered
        </Badge>
        <h2 className="text-3xl font-bold mb-2">Room Quality Scorer</h2>
        <p className="text-muted-foreground">
          Upload a room photo to get an instant AI-powered quality assessment
        </p>
      </div>

      {/* Upload Area */}
      {!imagePreview && (
        <Card>
          <CardContent className="pt-6">
            <label className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center gap-4 bg-muted/20">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">Drop your room photo here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (PNG, JPG up to 10MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview & Analysis */}
      {imagePreview && (
        <div className="space-y-6">
          {/* Image */}
          <Card>
            <CardContent className="pt-6">
              <img
                src={imagePreview}
                alt="Room preview"
                className="w-full max-h-[400px] object-cover rounded-xl"
              />
            </CardContent>
          </Card>

          {/* Analyze Button */}
          {!analysis && (
            <div className="flex justify-center gap-4">
              <Button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                size="lg"
                className="min-w-[200px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Room
                  </>
                )}
              </Button>
              <Button onClick={reset} variant="outline" size="lg">
                Upload Different Photo
              </Button>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Overall Score with Circle Progress */}
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
                    {/* Circular Score Indicator */}
                    <div className="relative">
                      <svg className="w-48 h-48 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="none"
                          className="text-muted/30"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${(analysis.overallScore / 10) * 553} 553`}
                          strokeLinecap="round"
                          className="text-primary transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-foreground">
                            {analysis.overallScore.toFixed(1)}
                          </div>
                          <div className="text-xl text-muted-foreground font-medium">/10</div>
                        </div>
                      </div>
                    </div>

                    {/* Score Description */}
                    <div className="max-w-md text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">Overall Room Quality</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {analysis.summary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Scores - Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(categoryIcons).map(([category, Icon]) => {
                  const data = analysis[category as keyof typeof categoryIcons]
                  const labels: Record<string, string> = {
                    lighting: 'Lighting',
                    cleanliness: 'Cleanliness',
                    space: 'Space',
                    ventilation: 'Ventilation',
                    furnishing: 'Furnishing',
                  }
                  return (
                    <CategoryScoreCard
                      key={category}
                      label={labels[category]}
                      score={data.score}
                      feedback={data.feedback}
                      Icon={Icon}
                    />
                  )
                })}
              </div>

              {/* Improvements */}
              {analysis.improvements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Suggested Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <Button onClick={reset} variant="outline">
                  Analyze Another Room
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}