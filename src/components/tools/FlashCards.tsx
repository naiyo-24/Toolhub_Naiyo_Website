import React, { useState } from 'react';
import { Clipboard, Plus, Trash2, ChevronRight, ChevronLeft, PenTool, Play } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export function FlashCards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  
  const [isStudying, setIsStudying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAddCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    
    setCards([...cards, { 
      id: Date.now().toString(), 
      question: newQuestion.trim(), 
      answer: newAnswer.trim() 
    }]);
    
    setNewQuestion('');
    setNewAnswer('');
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const startStudying = () => {
    if (cards.length === 0) return;
    setIsStudying(true);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const exitStudyMode = () => {
    setIsStudying(false);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#fb923c] p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            <Clipboard className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-3xl font-black uppercase leading-tight">Flashcards</h2>
        </div>
      </div>

      {!isStudying ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Create New Card */}
          <div className="bg-orange-50 border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_#000]">
            <h3 className="font-black uppercase text-xl mb-4 flex items-center gap-2">
              <PenTool className="w-6 h-6" />
              Create a Flashcard
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-black uppercase text-sm block mb-2">Front (Question)</label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What is the capital of France?"
                  rows={3}
                  className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-orange-400/50 transition-all resize-none"
                />
              </div>
              <div>
                <label className="font-black uppercase text-sm block mb-2">Back (Answer)</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g. Paris"
                  rows={3}
                  className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-orange-400/50 transition-all resize-none"
                />
              </div>
            </div>
            
            <button
              onClick={handleAddCard}
              disabled={!newQuestion.trim() || !newAnswer.trim()}
              className="mt-4 w-full md:w-auto bg-black text-white hover:bg-gray-800 disabled:opacity-50 border-4 border-black font-black py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
            >
              <Plus className="w-5 h-5" /> Add Card
            </button>
          </div>

          {/* Card List & Actions */}
          <div className="border-4 border-black rounded-xl p-6 shadow-[6px_6px_0px_0px_#000]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="font-black uppercase text-xl">
                Your Deck <span className="bg-[#fb923c] text-black px-2 py-1 rounded-md text-sm ml-2 border-2 border-black">{cards.length} cards</span>
              </h3>
              
              <button
                onClick={startStudying}
                disabled={cards.length === 0}
                className="bg-[#fb923c] hover:bg-orange-500 disabled:opacity-50 text-black border-4 border-black font-black py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1"
              >
                <Play className="w-5 h-5 fill-black" /> Start Studying
              </button>
            </div>

            {cards.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-bold border-2 border-dashed border-gray-300 rounded-xl">
                Your deck is empty. Create some cards above!
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {cards.map((card, idx) => (
                  <div key={card.id} className="flex justify-between items-center p-4 border-4 border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_#000]">
                    <div className="flex-1 mr-4">
                      <div className="font-bold text-sm text-gray-500 uppercase">Card {idx + 1}</div>
                      <div className="font-black line-clamp-1">{card.question}</div>
                    </div>
                    <button
                      onClick={() => removeCard(card.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 border-4 border-black rounded-lg transition-colors"
                      title="Delete Card"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-6">
            <button
              onClick={exitStudyMode}
              className="bg-white hover:bg-gray-100 text-black border-4 border-black font-black py-2 px-4 rounded-xl transition-colors uppercase text-sm shadow-[2px_2px_0px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
              Exit Study Mode
            </button>
            
            <div className="font-black text-lg text-gray-500 uppercase bg-gray-100 border-4 border-black px-4 py-1 rounded-full shadow-[2px_2px_0px_0px_#000]">
              Card {currentIndex + 1} of {cards.length}
            </div>
          </div>

          {/* Flashcard Container (Flip effect) */}
          <div 
            className="relative w-full max-w-2xl h-80 perspective-1000 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front: Question */}
              <div className="absolute w-full h-full backface-hidden bg-white border-4 border-black rounded-2xl shadow-[12px_12px_0px_0px_#000] flex items-center justify-center p-8 text-center">
                <div className="absolute top-4 left-4 bg-neo-yellow border-4 border-black px-3 py-1 font-black uppercase text-xs rotate-[-5deg] shadow-[2px_2px_0px_0px_#000]">Front</div>
                <h3 className="text-2xl md:text-3xl font-black text-black leading-snug">{cards[currentIndex].question}</h3>
                <div className="absolute bottom-4 right-4 text-gray-400 font-bold text-sm uppercase">Click to flip</div>
              </div>

              {/* Back: Answer */}
              <div className="absolute w-full h-full backface-hidden bg-[#fb923c] border-4 border-black rounded-2xl shadow-[12px_12px_0px_0px_#000] flex items-center justify-center p-8 text-center rotate-y-180">
                <div className="absolute top-4 right-4 bg-white border-4 border-black px-3 py-1 font-black uppercase text-xs rotate-[5deg] shadow-[2px_2px_0px_0px_#000]">Back</div>
                <p className="text-xl md:text-2xl font-bold text-black leading-relaxed">{cards[currentIndex].answer}</p>
              </div>
              
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-12 w-full max-w-md justify-center">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="bg-white hover:bg-gray-100 disabled:opacity-50 text-black border-4 border-black font-black p-4 rounded-xl flex items-center justify-center transition-colors shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 active:shadow-none"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextCard}
              disabled={currentIndex === cards.length - 1}
              className="bg-[#fb923c] hover:bg-orange-500 disabled:opacity-50 text-black border-4 border-black font-black p-4 rounded-xl flex items-center justify-center transition-colors shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 active:shadow-none"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export const flashCardsInstructions = [
  "Manually type out the Front (Question) and Back (Answer) for your custom flashcards.",
  "Click 'Add Card' to save it to your deck.",
  "When you are ready, click 'Start Studying' to enter the interactive 3D flip-card mode!",
  "Click the card to flip it over and use the arrows to move through your deck."
];
