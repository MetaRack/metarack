/**
 * @file InterpDelay2.hpp
 * @author Dale Johnson, Valley Audio Soft
 * @brief A more optimised version of the linear interpolating delay.
 */

#pragma once
#include <vector>

// #include <cstdint>
// #include "../Utilities.hpp"

float linterp(float a, float b, float f) {
    return a + f * (b - a);
}

template<typename T = float>
class InterpDelay2 {
public:
    T input = T(0);
    T output = T(0);

    InterpDelay2(uint64_t maxLength = 512, uint64_t initDelayTime = 0) {
        l = maxLength;
        buffer = std::vector<T>(l, T(0));
        setDelayTime(initDelayTime);
    }

    void process() {
        buffer[w] = input;
        int64_t r = w - t;
        if (r < 0) {
            r += l;
        }

        ++w;
        if (w == l) {
            w = 0;
        }

        int64_t upperR = r - 1;
        if (upperR < 0) {
            upperR += l;
        }

        output = linterp(buffer[r], buffer[upperR], f);
    }

    void blockProcess(const T* inputBuffer, T* outputBuffer, const uint64_t blockSize) {
        for (uint64_t i = 0; i < blockSize; ++i) {
            buffer[w] = inputBuffer[i];
            int64_t r = w - t;
            if (r < 0) {
                r += l;
            }

            ++w;
            if (w == l) {
                w = 0;
            }

            int64_t upperR = r - 1;
            if (upperR < 0) {
                upperR += l;
            }

            outputBuffer[i] = linterp(buffer[r], buffer[upperR], f);
        }
    }

    T tap(int64_t i) const {
        int64_t j = w - i;
        if (j < 0) {
            j += l;
        }
        return buffer[j];
    }

    void setDelayTime(T newDelayTime) {
        if (newDelayTime >= l) {
            newDelayTime = l - 1;
        }
        if (newDelayTime < 0) {
            newDelayTime = 0;
        }
        t = static_cast<int64_t>(newDelayTime);
        f = newDelayTime - static_cast<T>(t);
    }

    void clear() {
        std::fill(buffer.begin(), buffer.end(), T(0));
        input = T(0);
        output = T(0);
    }

private:
    std::vector<T> buffer;
    int64_t w = 0;
    int64_t t = 0;
    T f = T(0);
    int64_t l = 512;
};

