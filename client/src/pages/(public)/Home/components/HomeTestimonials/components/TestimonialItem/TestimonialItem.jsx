import { Quote, Star } from 'lucide-react';

function TestimonialItem({ testimonial }) {
  return (
    <div className="flex flex-col h-full p-4">
      <Quote size={32} className="text-purple-500 fill-purple-500/20" />
      <p className="mt-4 text-[16px] text-(--text-primary)/70 italic flex-1">
        {testimonial.quote}
      </p>
      <div className="flex items-center mt-6">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="object-cover w-12 h-12 border rounded-full border-(--text-primary)/10"
        />
        <div className="flex items-center justify-between flex-1 ml-4">
          <div>
            <h4 className="text-sm font-bold leading-none text-(--text-primary)">
              {testimonial.name}
            </h4>
            <p className="mt-1 text-xs text-(--text-primary)/60">{testimonial.role}</p>
          </div>

          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < testimonial.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-zinc-600'
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialItem;
