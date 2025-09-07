import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Copy, 
  Settings, 
  Save,
  ChevronUp,
  ChevronDown,
  GripVertical,
  FileText,
  BarChart3,
  CheckSquare,
  Star,
  Calendar,
  Hash
} from 'lucide-react';

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'multiple_choice' | 'rating' | 'checkbox' | 'number' | 'date';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  settings?: {
    minRating?: number;
    maxRating?: number;
    allowOther?: boolean;
  };
}

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  estimatedDuration: string;
  incentive?: string;
  isPublic: boolean;
  questions: Question[];
  status: 'draft' | 'active' | 'closed';
  createdAt: Date;
}

export const SurveyBuilderTab = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      title: 'PT Technology Adoption Survey',
      description: 'Understanding how PTs are adopting new technologies in practice',
      category: 'technology',
      targetAudience: 'practicing_pts',
      estimatedDuration: '8-10 minutes',
      incentive: '$15 gift card',
      isPublic: true,
      status: 'active',
      createdAt: new Date('2024-01-15'),
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          title: 'What is your primary practice setting?',
          required: true,
          options: ['Outpatient clinic', 'Hospital', 'Home health', 'Sports medicine', 'Private practice']
        }
      ]
    }
  ]);

  const questionTypes = [
    { value: 'text', label: 'Short Text', icon: <FileText className="h-4 w-4" /> },
    { value: 'textarea', label: 'Long Text', icon: <FileText className="h-4 w-4" /> },
    { value: 'multiple_choice', label: 'Multiple Choice', icon: <CheckSquare className="h-4 w-4" /> },
    { value: 'checkbox', label: 'Checkboxes', icon: <CheckSquare className="h-4 w-4" /> },
    { value: 'rating', label: 'Rating Scale', icon: <Star className="h-4 w-4" /> },
    { value: 'number', label: 'Number', icon: <Hash className="h-4 w-4" /> },
    { value: 'date', label: 'Date', icon: <Calendar className="h-4 w-4" /> }
  ];

  const categories = [
    { value: 'apta', label: 'APTA Research' },
    { value: 'compensation', label: 'Compensation' },
    { value: 'settings', label: 'Practice Settings' },
    { value: 'research', label: 'Clinical Research' },
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'wellness', label: 'Professional Wellness' }
  ];

  const targetAudiences = [
    { value: 'practicing_pts', label: 'Practicing PTs' },
    { value: 'pt_students', label: 'PT Students' },
    { value: 'pt_assistants', label: 'PT Assistants' },
    { value: 'clinic_owners', label: 'Clinic Owners' },
    { value: 'pt_educators', label: 'PT Educators' },
    { value: 'all_professionals', label: 'All PT Professionals' }
  ];

  const createNewSurvey = () => {
    const newSurvey: Survey = {
      id: Date.now().toString(),
      title: 'New Survey',
      description: '',
      category: 'research',
      targetAudience: 'practicing_pts',
      estimatedDuration: '5-10 minutes',
      incentive: '',
      isPublic: true,
      status: 'draft',
      createdAt: new Date(),
      questions: []
    };
    setSurveys([newSurvey, ...surveys]);
    setSelectedSurvey(newSurvey);
    setIsEditing(true);
    setShowPreview(false);
  };

  const addQuestion = () => {
    if (!selectedSurvey) return;
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'text',
      title: 'New Question',
      required: false
    };

    const updatedSurvey = {
      ...selectedSurvey,
      questions: [...selectedSurvey.questions, newQuestion]
    };

    setSelectedSurvey(updatedSurvey);
    updateSurvey(updatedSurvey);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    if (!selectedSurvey) return;

    const updatedQuestions = selectedSurvey.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    const updatedSurvey = {
      ...selectedSurvey,
      questions: updatedQuestions
    };

    setSelectedSurvey(updatedSurvey);
    updateSurvey(updatedSurvey);
  };

  const deleteQuestion = (questionId: string) => {
    if (!selectedSurvey) return;

    const updatedSurvey = {
      ...selectedSurvey,
      questions: selectedSurvey.questions.filter(q => q.id !== questionId)
    };

    setSelectedSurvey(updatedSurvey);
    updateSurvey(updatedSurvey);
  };

  const updateSurvey = (updatedSurvey: Survey) => {
    setSurveys(surveys.map(s => s.id === updatedSurvey.id ? updatedSurvey : s));
  };

  const duplicateSurvey = (survey: Survey) => {
    const duplicated: Survey = {
      ...survey,
      id: Date.now().toString(),
      title: `${survey.title} (Copy)`,
      status: 'draft',
      createdAt: new Date()
    };
    setSurveys([duplicated, ...surveys]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'draft': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'closed': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  if (showPreview && selectedSurvey) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Survey Preview</h2>
          </div>
          <Button onClick={() => setShowPreview(false)} variant="outline">
            Back to Editor
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedSurvey.title}</CardTitle>
            <p className="text-muted-foreground">{selectedSurvey.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Duration: {selectedSurvey.estimatedDuration}</Badge>
              {selectedSurvey.incentive && (
                <Badge variant="outline">Incentive: {selectedSurvey.incentive}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedSurvey.questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground mt-1">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {question.title}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    {question.description && (
                      <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                    )}
                    
                    <div className="mt-3">
                      {question.type === 'text' && (
                        <Input placeholder="Your answer..." className="max-w-md" />
                      )}
                      {question.type === 'textarea' && (
                        <Textarea placeholder="Your answer..." className="max-w-md" />
                      )}
                      {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input type="radio" name={question.id} className="rounded" />
                              <label className="text-sm">{option}</label>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === 'checkbox' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" />
                              <label className="text-sm">{option}</label>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === 'rating' && (
                        <div className="flex gap-1">
                          {Array.from({ length: question.settings?.maxRating || 5 }).map((_, i) => (
                            <Star key={i} className="h-6 w-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-6 border-t">
              <Button className="w-full md:w-auto">Submit Survey</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditing && selectedSurvey) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Survey Builder</h2>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowPreview(true)} variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
              Done Editing
            </Button>
          </div>
        </div>

        {/* Survey Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Survey Title</Label>
                <Input
                  id="title"
                  value={selectedSurvey.title}
                  onChange={(e) => {
                    const updated = { ...selectedSurvey, title: e.target.value };
                    setSelectedSurvey(updated);
                    updateSurvey(updated);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={selectedSurvey.category}
                  onValueChange={(value) => {
                    const updated = { ...selectedSurvey, category: value };
                    setSelectedSurvey(updated);
                    updateSurvey(updated);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={selectedSurvey.description}
                  onChange={(e) => {
                    const updated = { ...selectedSurvey, description: e.target.value };
                    setSelectedSurvey(updated);
                    updateSurvey(updated);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select 
                  value={selectedSurvey.targetAudience}
                  onValueChange={(value) => {
                    const updated = { ...selectedSurvey, targetAudience: value };
                    setSelectedSurvey(updated);
                    updateSurvey(updated);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAudiences.map((audience) => (
                      <SelectItem key={audience.value} value={audience.value}>
                        {audience.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <Input
                  id="duration"
                  value={selectedSurvey.estimatedDuration}
                  onChange={(e) => {
                    const updated = { ...selectedSurvey, estimatedDuration: e.target.value };
                    setSelectedSurvey(updated);
                    updateSurvey(updated);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incentive">Incentive (Optional)</Label>
                <Input
                  id="incentive"
                  value={selectedSurvey.incentive || ''}
                  onChange={(e) => {
                    const updated = { ...selectedSurvey, incentive: e.target.value };
                    setSelectedSurvey(updated);
                    updateSurvey(updated);
                  }}
                  placeholder="e.g., $20 gift card"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={selectedSurvey.isPublic}
                  onCheckedChange={(checked) => {
                    const updated = { ...selectedSurvey, isPublic: checked };
                    setSelectedSurvey(updated);
                    updateSurvey(updated);
                  }}
                />
                <Label htmlFor="public">Make survey public</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Questions ({selectedSurvey.questions.length})</CardTitle>
              <Button onClick={addQuestion} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSurvey.questions.map((question, index) => (
              <Card key={question.id} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Question {index + 1}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select 
                          value={question.type}
                          onValueChange={(value: any) => updateQuestion(question.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {questionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  {type.icon}
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`required-${question.id}`}
                          checked={question.required}
                          onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
                        />
                        <Label htmlFor={`required-${question.id}`}>Required</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Question Title</Label>
                      <Input
                        value={question.title}
                        onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Input
                        value={question.description || ''}
                        onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                        placeholder="Additional context or instructions"
                      />
                    </div>

                    {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        <div className="space-y-2">
                          {(question.options || []).map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [])];
                                  newOptions[optIndex] = e.target.value;
                                  updateQuestion(question.id, { options: newOptions });
                                }}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const newOptions = question.options?.filter((_, i) => i !== optIndex);
                                  updateQuestion(question.id, { options: newOptions });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newOptions = [...(question.options || []), ''];
                              updateQuestion(question.id, { options: newOptions });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}

                    {question.type === 'rating' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Maximum Rating</Label>
                          <Select 
                            value={question.settings?.maxRating?.toString() || '5'}
                            onValueChange={(value) => 
                              updateQuestion(question.id, { 
                                settings: { ...question.settings, maxRating: parseInt(value) }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Points</SelectItem>
                              <SelectItem value="5">5 Points</SelectItem>
                              <SelectItem value="7">7 Points</SelectItem>
                              <SelectItem value="10">10 Points</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {selectedSurvey.questions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No questions added yet.</p>
                <p className="text-sm text-muted-foreground">Click "Add Question" to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Survey Builder</h2>
        </div>
        <Button onClick={createNewSurvey}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Survey
        </Button>
      </div>

      {/* My Surveys */}
      <Card>
        <CardHeader>
          <CardTitle>My Surveys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{survey.title}</h3>
                    <Badge className={getStatusColor(survey.status)}>
                      {survey.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{survey.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{survey.questions.length} questions</span>
                    <span>{survey.estimatedDuration}</span>
                    <span>Created {survey.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedSurvey(survey);
                      setIsEditing(true);
                      setShowPreview(false);
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedSurvey(survey);
                      setShowPreview(true);
                      setIsEditing(false);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => duplicateSurvey(survey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};