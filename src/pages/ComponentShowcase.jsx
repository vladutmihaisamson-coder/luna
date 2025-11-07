import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Alert, 
  Checkbox, 
  Progress, 
  Spinner 
} from '../components/ui';
import './ComponentShowcase.css';

function ComponentShowcase() {
  const [inputValue, setInputValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [progress, setProgress] = useState(65);

  return (
    <div className="showcase">
      <BackButton />
      <header className="showcase-header">
        <h1>Component Showcase</h1>
        <p>All Luna Design System components ready for rapid prototyping</p>
      </header>

      <div className="showcase-content">
        {/* Buttons */}
        <section className="showcase-section">
          <h2>Buttons</h2>
          <p className="section-description">
            Three button variants: primary (Electric Blue), secondary (gray outline), and ghost (minimal).
          </p>
          
          <div className="component-demo">
            <h3>Variants</h3>
            <div className="demo-row">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          <div className="component-demo">
            <h3>Sizes</h3>
            <div className="demo-row">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
          </div>

          <div className="component-demo">
            <h3>States</h3>
            <div className="demo-row">
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" fullWidth>Full Width</Button>
            </div>
          </div>

          <div className="code-example">
            <pre>{`import { Button } from './components/ui';

<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">More Options</Button>`}</pre>
          </div>
        </section>

        {/* Cards */}
        <section className="showcase-section">
          <h2>Cards</h2>
          <p className="section-description">
            Container components for organizing content with subtle borders and shadows.
          </p>

          <div className="component-demo">
            <h3>Variants</h3>
            <div className="demo-grid">
              <Card variant="default">
                <h4>Default Card</h4>
                <p>Clean card with standard styling</p>
              </Card>
              <Card variant="accent">
                <h4>Accent Card</h4>
                <p>Card with colored top border</p>
              </Card>
              <Card variant="subtle">
                <h4>Subtle Card</h4>
                <p>Card with subtle background</p>
              </Card>
            </div>
          </div>

          <div className="component-demo">
            <h3>Hoverable</h3>
            <div className="demo-grid">
              <Card hoverable>
                <h4>Hover Me</h4>
                <p>This card lifts on hover</p>
              </Card>
            </div>
          </div>

          <div className="code-example">
            <pre>{`import { Card } from './components/ui';

<Card variant="default">
  <h4>Title</h4>
  <p>Content here</p>
</Card>`}</pre>
          </div>
        </section>

        {/* Inputs */}
        <section className="showcase-section">
          <h2>Input Fields</h2>
          <p className="section-description">
            Fully rounded input fields with Electric Blue focus states.
          </p>

          <div className="component-demo">
            <h3>Types</h3>
            <div className="demo-column">
              <Input 
                type="text" 
                placeholder="Text input" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input type="email" placeholder="Email input" />
              <Input type="password" placeholder="Password input" />
              <Input type="number" placeholder="Number input" />
            </div>
          </div>

          <div className="component-demo">
            <h3>States</h3>
            <div className="demo-column">
              <Input placeholder="Normal" />
              <Input placeholder="Disabled" disabled />
              <Input placeholder="Error" error />
              <Input placeholder="Full width" fullWidth />
            </div>
          </div>

          <div className="code-example">
            <pre>{`import { Input } from './components/ui';

<Input 
  type="email" 
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>`}</pre>
          </div>
        </section>

        {/* Badges */}
        <section className="showcase-section">
          <h2>Badges</h2>
          <p className="section-description">
            Small labels for status, categories, or counts in subtle gray tones.
          </p>

          <div className="component-demo">
            <h3>Variants</h3>
            <div className="demo-row">
              <Badge variant="solid">Solid</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="subtle">Subtle</Badge>
            </div>
          </div>

          <div className="component-demo">
            <h3>Sizes</h3>
            <div className="demo-row">
              <Badge variant="solid" size="sm">Small</Badge>
              <Badge variant="solid" size="md">Medium</Badge>
            </div>
          </div>

          <div className="code-example">
            <pre>{`import { Badge } from './components/ui';

<Badge variant="solid">New</Badge>
<Badge variant="outline">Beta</Badge>
<Badge variant="subtle">v2.0</Badge>`}</pre>
          </div>
        </section>

        {/* Alerts */}
        <section className="showcase-section">
          <h2>Alerts</h2>
          <p className="section-description">
            Informative messages with neutral gray styling.
          </p>

          <div className="component-demo">
            <Alert title="Information" icon="ℹ">
              This is a standard informational message with neutral gray styling.
            </Alert>
            <Alert title="Tip" icon="💡">
              You can customize the icon to match your message type.
            </Alert>
            <Alert icon="⚠️">
              Alert without a title, showing just the message content.
            </Alert>
          </div>

          <div className="code-example">
            <pre>{`import { Alert } from './components/ui';

<Alert title="Success" icon="✓">
  Your changes have been saved!
</Alert>`}</pre>
          </div>
        </section>

        {/* Checkboxes */}
        <section className="showcase-section">
          <h2>Checkboxes</h2>
          <p className="section-description">
            Form controls with Electric Blue accent color.
          </p>

          <div className="component-demo">
            <div className="demo-column">
              <Checkbox 
                label="Accept terms and conditions" 
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
              <Checkbox label="Receive email notifications" />
              <Checkbox label="Disabled option" disabled />
            </div>
          </div>

          <div className="code-example">
            <pre>{`import { Checkbox } from './components/ui';

<Checkbox 
  label="Remember me" 
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>`}</pre>
          </div>
        </section>

        {/* Progress */}
        <section className="showcase-section">
          <h2>Progress Bars</h2>
          <p className="section-description">
            Progress indicators using Electric Blue to show completion.
          </p>

          <div className="component-demo">
            <h3>Sizes</h3>
            <div className="demo-column">
              <div>
                <label>Small</label>
                <Progress value={progress} size="sm" />
              </div>
              <div>
                <label>Medium</label>
                <Progress value={progress} size="md" />
              </div>
              <div>
                <label>Large</label>
                <Progress value={progress} size="lg" />
              </div>
              <div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  Increase Progress
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  Decrease
                </Button>
              </div>
            </div>
          </div>

          <div className="code-example">
            <pre>{`import { Progress } from './components/ui';

<Progress value={65} size="md" />`}</pre>
          </div>
        </section>

        {/* Spinners */}
        <section className="showcase-section">
          <h2>Spinners</h2>
          <p className="section-description">
            Loading indicators with Electric Blue accent.
          </p>

          <div className="component-demo">
            <h3>Sizes</h3>
            <div className="demo-row">
              <div className="spinner-demo">
                <Spinner size="sm" />
                <span>Small</span>
              </div>
              <div className="spinner-demo">
                <Spinner size="md" />
                <span>Medium</span>
              </div>
              <div className="spinner-demo">
                <Spinner size="lg" />
                <span>Large</span>
              </div>
            </div>
          </div>

          <div className="code-example">
            <pre>{`import { Spinner } from './components/ui';

<Spinner size="md" />`}</pre>
          </div>
        </section>

        {/* Full Example */}
        <section className="showcase-section">
          <h2>Complete Example</h2>
          <p className="section-description">
            A realistic form using multiple components together.
          </p>

          <Card variant="default" className="example-form">
            <h3>Create Account</h3>
            <Alert icon="💡">
              All fields are required to create your account.
            </Alert>
            <div className="form-group">
              <Input type="text" placeholder="Full Name" fullWidth />
            </div>
            <div className="form-group">
              <Input type="email" placeholder="Email Address" fullWidth />
            </div>
            <div className="form-group">
              <Input type="password" placeholder="Password" fullWidth />
            </div>
            <div className="form-group">
              <Checkbox label="I agree to the terms and conditions" />
            </div>
            <div className="form-actions">
              <Button variant="primary" fullWidth>Create Account</Button>
              <Button variant="ghost" fullWidth>Already have an account?</Button>
            </div>
          </Card>

          <div className="code-example">
            <pre>{`import { Button, Card, Input, Checkbox, Alert } from './components/ui';

<Card>
  <h3>Create Account</h3>
  <Alert icon="💡">All fields are required.</Alert>
  <Input type="text" placeholder="Full Name" fullWidth />
  <Input type="email" placeholder="Email" fullWidth />
  <Input type="password" placeholder="Password" fullWidth />
  <Checkbox label="I agree to terms" />
  <Button variant="primary" fullWidth>Create Account</Button>
</Card>`}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ComponentShowcase;

