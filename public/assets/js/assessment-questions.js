// Comprehensive Personality Assessment Questions
const AssessmentQuestions = {
    categories: {
        personality: {
            title: "Personality Traits",
            questions: [
                { id: 'p1', text: 'I enjoy being the center of attention in social gatherings', type: 'scale' },
                { id: 'p2', text: 'I prefer working alone rather than in groups', type: 'scale' },
                { id: 'p3', text: 'I am comfortable taking risks and trying new things', type: 'scale' },
                { id: 'p4', text: 'I get stressed easily when things don\'t go as planned', type: 'scale' },
                { id: 'p5', text: 'I enjoy meeting new people and making friends', type: 'scale' },
                { id: 'p6', text: 'I prefer routine and predictability in my daily life', type: 'scale' },
                { id: 'p7', text: 'I am detail-oriented and notice small things others miss', type: 'scale' },
                { id: 'p8', text: 'I trust my gut feelings when making decisions', type: 'scale' }
            ]
        },
        emotional: {
            title: "Emotional Intelligence",
            questions: [
                { id: 'e1', text: 'I can easily identify and name my emotions', type: 'scale' },
                { id: 'e2', text: 'I am good at understanding how others feel', type: 'scale' },
                { id: 'e3', text: 'I can calm myself down when I feel upset or angry', type: 'scale' },
                { id: 'e4', text: 'I often worry about things that might go wrong', type: 'scale' },
                { id: 'e5', text: 'I bounce back quickly from setbacks', type: 'scale' },
                { id: 'e6', text: 'I express my feelings openly to others', type: 'scale' },
                { id: 'e7', text: 'I can motivate myself even when tasks are difficult', type: 'scale' },
                { id: 'e8', text: 'I handle criticism well without taking it personally', type: 'scale' }
            ]
        },
        lifestyle: {
            title: "Lifestyle & Habits",
            questions: [
                { id: 'l1', text: 'I exercise regularly (3+ times per week)', type: 'scale' },
                { id: 'l2', text: 'I get 7-8 hours of sleep most nights', type: 'scale' },
                { id: 'l3', text: 'I eat a balanced diet with fruits and vegetables', type: 'scale' },
                { id: 'l4', text: 'I spend too much time on social media or screens', type: 'scale' },
                { id: 'l5', text: 'I have hobbies that I actively pursue', type: 'scale' },
                { id: 'l6', text: 'I practice mindfulness or meditation', type: 'scale' },
                { id: 'l7', text: 'I maintain a good work-life balance', type: 'scale' },
                { id: 'l8', text: 'I avoid procrastination and meet deadlines', type: 'scale' }
            ]
        },
        relationships: {
            title: "Relationships & Social Life",
            questions: [
                { id: 'r1', text: 'I have close friends I can confide in', type: 'scale' },
                { id: 'r2', text: 'I am satisfied with my current relationships', type: 'scale' },
                { id: 'r3', text: 'I communicate effectively in conflicts', type: 'scale' },
                { id: 'r4', text: 'I spend quality time with family and friends', type: 'scale' },
                { id: 'r5', text: 'I am a good listener when others share problems', type: 'scale' },
                { id: 'r6', text: 'I trust people easily', type: 'scale' },
                { id: 'r7', text: 'I prefer deep conversations over small talk', type: 'scale' },
                { id: 'r8', text: 'I forgive people who have hurt me', type: 'scale' }
            ]
        },
        goals: {
            title: "Goals & Motivation",
            questions: [
                { id: 'g1', text: 'I have clear goals for my future', type: 'scale' },
                { id: 'g2', text: 'I take action towards achieving my goals', type: 'scale' },
                { id: 'g3', text: 'I am satisfied with my progress in life', type: 'scale' },
                { id: 'g4', text: 'I give up easily when faced with obstacles', type: 'scale' },
                { id: 'g5', text: 'I celebrate my achievements, big and small', type: 'scale' },
                { id: 'g6', text: 'I know what motivates and inspires me', type: 'scale' },
                { id: 'g7', text: 'I regularly reflect on my personal growth', type: 'scale' },
                { id: 'g8', text: 'I am optimistic about my future', type: 'scale' }
            ]
        },
        stress: {
            title: "Stress & Coping",
            questions: [
                { id: 's1', text: 'I feel overwhelmed by my responsibilities', type: 'scale' },
                { id: 's2', text: 'I have healthy ways to cope with stress', type: 'scale' },
                { id: 's3', text: 'I know when to ask for help', type: 'scale' },
                { id: 's4', text: 'I take breaks when I feel burnout approaching', type: 'scale' },
                { id: 's5', text: 'I worry about things I cannot control', type: 'scale' },
                { id: 's6', text: 'I can say no without feeling guilty', type: 'scale' },
                { id: 's7', text: 'I prioritize self-care in my daily routine', type: 'scale' },
                { id: 's8', text: 'I recover quickly from stressful situations', type: 'scale' }
            ]
        }
    },

    scaleOptions: [
        { value: 1, label: 'Strongly Disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree' },
        { value: 5, label: 'Strongly Agree' }
    ],

    // Calculate personality profile from responses
    calculateProfile(responses) {
        const scores = {
            extraversion: 0,
            openness: 0,
            conscientiousness: 0,
            emotionalStability: 0,
            agreeableness: 0,
            lifestyle: 0,
            relationships: 0,
            goalsMotivation: 0,
            stressManagement: 0
        };

        // Extraversion
        scores.extraversion = (responses.p1 + responses.p5 + (6 - responses.p2)) / 3;
        
        // Openness
        scores.openness = (responses.p3 + (6 - responses.p6) + responses.p8) / 3;
        
        // Conscientiousness
        scores.conscientiousness = (responses.p7 + responses.l8 + responses.g2) / 3;
        
        // Emotional Stability
        scores.emotionalStability = (responses.e1 + responses.e3 + responses.e5 + (6 - responses.e4) + responses.e8) / 5;
        
        // Agreeableness
        scores.agreeableness = (responses.e2 + responses.r5 + responses.r6 + responses.r8) / 4;
        
        // Lifestyle Health
        scores.lifestyle = (responses.l1 + responses.l2 + responses.l3 + (6 - responses.l4) + responses.l5 + responses.l7) / 6;
        
        // Relationships
        scores.relationships = (responses.r1 + responses.r2 + responses.r3 + responses.r4) / 4;
        
        // Goals & Motivation
        scores.goalsMotivation = (responses.g1 + responses.g2 + responses.g3 + (6 - responses.g4) + responses.g5 + responses.g6 + responses.g8) / 7;
        
        // Stress Management
        scores.stressManagement = ((6 - responses.s1) + responses.s2 + responses.s3 + responses.s4 + (6 - responses.s5) + responses.s6 + responses.s7 + responses.s8) / 8;

        return scores;
    },

    // Generate personality type
    getPersonalityType(scores) {
        const types = [];
        
        if (scores.extraversion >= 4) types.push('Extraverted');
        else if (scores.extraversion <= 2) types.push('Introverted');
        else types.push('Ambiverted');
        
        if (scores.openness >= 4) types.push('Innovative');
        else if (scores.openness <= 2) types.push('Traditional');
        else types.push('Balanced');
        
        if (scores.conscientiousness >= 4) types.push('Organized');
        else if (scores.conscientiousness <= 2) types.push('Spontaneous');
        else types.push('Flexible');
        
        return types.join(' • ');
    },

    // Generate strengths
    getStrengths(scores) {
        const strengths = [];
        
        if (scores.emotionalStability >= 4) strengths.push('Emotionally resilient and stable');
        if (scores.agreeableness >= 4) strengths.push('Empathetic and cooperative');
        if (scores.goalsMotivation >= 4) strengths.push('Goal-oriented and motivated');
        if (scores.relationships >= 4) strengths.push('Strong interpersonal relationships');
        if (scores.lifestyle >= 4) strengths.push('Healthy lifestyle habits');
        if (scores.stressManagement >= 4) strengths.push('Excellent stress management');
        if (scores.conscientiousness >= 4) strengths.push('Highly organized and reliable');
        if (scores.openness >= 4) strengths.push('Open to new experiences');
        
        return strengths.length > 0 ? strengths : ['Self-aware and willing to grow'];
    },

    // Generate areas for growth
    getAreasForGrowth(scores) {
        const areas = [];
        
        if (scores.emotionalStability < 3) areas.push('Developing emotional regulation skills');
        if (scores.stressManagement < 3) areas.push('Building better stress coping mechanisms');
        if (scores.lifestyle < 3) areas.push('Improving daily health habits');
        if (scores.relationships < 3) areas.push('Strengthening social connections');
        if (scores.goalsMotivation < 3) areas.push('Setting and pursuing clear goals');
        if (scores.conscientiousness < 3) areas.push('Enhancing organization and follow-through');
        
        return areas.length > 0 ? areas : ['Continue personal development'];
    },

    // Generate recommendations
    getRecommendations(scores) {
        const recommendations = [];
        
        if (scores.lifestyle < 4) {
            recommendations.push({
                category: 'Lifestyle',
                suggestion: 'Focus on establishing a consistent sleep schedule and regular exercise routine',
                priority: 'high'
            });
        }
        
        if (scores.stressManagement < 4) {
            recommendations.push({
                category: 'Wellness',
                suggestion: 'Try mindfulness meditation or journaling to manage stress better',
                priority: 'high'
            });
        }
        
        if (scores.relationships < 4) {
            recommendations.push({
                category: 'Social',
                suggestion: 'Schedule regular time with friends and family to strengthen bonds',
                priority: 'medium'
            });
        }
        
        if (scores.goalsMotivation < 4) {
            recommendations.push({
                category: 'Personal Growth',
                suggestion: 'Set SMART goals and track your progress using the TimeCapsule feature',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
};
